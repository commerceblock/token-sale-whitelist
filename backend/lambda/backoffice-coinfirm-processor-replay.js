// imports
import AWS from 'aws-sdk';
import fetch from 'isomorphic-fetch';
import httpStatus from 'http-status-codes';
import { map, isEmpty, filter, size, find } from 'lodash';
import { createLogger } from 'bunyan';

// local imports
import { parseRecords } from '../lib/http-util';
import {
  stream_name,
  event_type,
  coinfirm_api,
  disabled_coinfirm_api,
} from '../model/consts';
import { saveEvent, loadEvents } from '../lib/events-store';
import { createOrderedId } from '../lib/uuid';
import { coinfirmApiTokenPromise } from '../model/secrets';


// logging
const log = createLogger({ name: 'backoffice-coinfirm-processor-replay' });

const api_prefix = `${coinfirm_api}/v2/reports/aml/basic`;
const headersPromise = coinfirmApiTokenPromise
  .then(token => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }));

export function handleSuccess(result, callback) {
  log.info('all records were processed successfully');
  callback();
}

export function handleError(error, callback) {
  log.error({ error }, 'failed to process records, abort batch');
  callback('abort batch');
}

export function processResponse(address, result) {
  if (result.status === httpStatus.OK) {
    return result.json()
      .then(data => {
        log.info({ address, data }, 'got success');
        return {
          address,
          result: data,
        };
      });
  }
  log.error({
    address,
    status: result.status,
    result,
  }, 'got failure');
  return Promise.reject(`invalid response, address=${address}`);
}

export function storeResponse(response) {
  const address = response.address;
  const result = response.result;
  const address_type = result.address_type;
  const recommendation = result.recommendation;
  const status = recommendation <= 1 ? 'accepted' : 'rejected';
  const payload = {
    address,
    event_id: createOrderedId(),
    type: event_type.address_verified,
    timestamp: new Date().toISOString(),
    data: {
      status,
      address_type,
      recommendation,
    },
  };
  return saveEvent(payload);
}

export function fetchResponse(address) {
  return headersPromise
    .then(headers => fetch(`${api_prefix}/${address}`, { headers }))
    .then(res => processResponse(address, res));
}

export function createTask(event) {
  try {
    const address = event.address;
    return loadEvents(address)
      .then(events => {
        if (find(events, {type: event_type.address_verified}) === undefined) {
          log.info(`fix address ${address}`);
          return fetchResponse(address)
            .then(storeResponse);
        }
        // skip
        log.info(`skip address ${address}`);
        return Promise.resolve();
      });
  } catch (error) {
    log.error({
      error,
      event,
    }, 'an error occured while processing event');
    throw new Error('an error occured while processing event');
  }
}

export function process(event, context, callback) {
  log.info(event, 'Received event');

  // parse event
  const events = parseRecords(event);
  const filteredEvents = filter(events, { type: event_type.address_created });
  if (isEmpty(events)) {
    log.info('empty batch');
    callback();
    return;
  }
  log.info(`processing ${size(filteredEvents)}`);
  Promise.all(map(filteredEvents, createTask))
    .then(result => handleSuccess(result, callback))
    .catch(error => handleError(error, callback));
}
