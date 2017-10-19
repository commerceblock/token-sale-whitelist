// imports
import 'whatwg-fetch'
import AWS from 'aws-sdk'
import { map, isEmpty, filter } from 'lodash'

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
    const tasks = Promise.all(map(filteredEvents, createTask));
  }
}

function handleError(error, callback) {
  log.error({ error }, 'failed to process event, abort batch.');
  callback('abort batch');
}

function createTask(event) {
  const address = event.address;
  return fetch(`${api_prefix}/${address}`, {
      headers: DEFAULT_HEADERS
    })
    .then(processResponse)
    .then(storeResponse)
}

function processResponse(result) {
  if (result.status === httpStatus.OK) {
    return result.json();
  } else {
    log.error({
      address,
      status: result.status,
      result
    }, 'got failure');
    return null;
  }
}

function storeResponse(data) {
  log.info({ data }, 'store result');
  const address_type = data.address_type;
  const recommenation = data.recommenation;
  const status = recommenation <= 1 ? 'accepted' : 'rejected';
  const payload = {
    address,
    event_id: createOrderedId(),
    type: event_type.address_verified,
    timestamp: new Date().toISOString(),
    data: {
      status,
      address_type,
    },
  };
  return saveEvent(payload);
}
