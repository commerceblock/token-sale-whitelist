// imports
import AWS from 'aws-sdk'
import fetch from 'isomorphic-fetch';
import httpStatus from 'http-status-codes';
import { map, isEmpty, filter, size } from 'lodash'

// local imports
import { parseRecords } from '../lib/http-util'
import {
  stream_name,
  event_type,
  coinfirm_api,
  coinfirm_api_token,
} from '../model/consts'
import { saveEvent } from '../lib/events-store'
import { createOrderedId } from '../lib/uuid'

// logging
import { createLogger } from 'bunyan'

const log = createLogger({ name: 'backoffice-coinfirm-processor' });

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${coinfirm_api_token}`,
};
const api_prefix = `${coinfirm_api}/v2/reports/aml/basic`;


export function process(event, context, callback) {
  log.info(event, 'Received event');

  // parse event
  const events = parseRecords(event);
  const filteredEvents = filter(events, { type: event_type.address_created })
  if (isEmpty(events)) {
    log.info('empty batch');
    return callback();
  } else {
    log.info(`processing ${size(filteredEvents)}`)
    Promise.all(map(filteredEvents, createTask))
      .then(result => handleSuccess(result, callback))
      .catch(error => handleError(error, callback));
  }
}

export function handleSuccess(result, callback) {
  log.info('all records were processed successfully');
  callback();
}

export function handleError(error, callback) {
  log.error({ error }, 'failed to process records, abort batch');
  callback('abort batch');
}

export function createTask(event) {
  try {
    const address = event.address;
    return fetch(`${api_prefix}/${address}`, {
        headers: DEFAULT_HEADERS
      })
      .then(res => processResponse(address, res))
      .then(storeResponse)
      .catch(error => {
        log.error({ error }, `failed to handle ${address}`);
      });
  } catch (error) {
    log.error({
      error,
      event,
    }, 'an error occured while processing event');
  }
}

export function processResponse(address, result) {
  if (result.status === httpStatus.OK) {
    return result.json()
      .then(data => {
        log.info({ address, data }, 'got success');
        return {
          address,
          result: data
        }
      });
  } else {
    log.error({
      address,
      status: result.status,
      result
    }, 'got failure');
    return Promise.reject(`invlaid response, address=${address}`)
  }
}

export function storeResponse(response) {
  const address = response.address;
  const result = response.result
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
