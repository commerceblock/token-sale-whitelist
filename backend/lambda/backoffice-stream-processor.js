
// imports
import AWS from 'aws-sdk';

// local imports
import {
  parseEvent,
  executePromises,
} from '../lib/http-util';
import {
  event_type,
} from '../model/consts';

// logging
import { createLogger } from 'bunyan';
const log = createLogger({ name: 'backoffice-stream-processor' });

// TOD: inject externally
export function process(event, context, callback) {
  log.info(event, 'Received event');
  // parse events
  const events = httpUtil.parseEvent(event);
  // filter events
  const filteredEvents = _.filter(events, {
    type: event_type.address_created
  });
  // build promises
  const promises = Promise.all(_.map(filteredEvents, createPromise));
  // execute promises
  return executePromises(promises, log, callback);
};

const createPromise = (event) => {
  // TODO

};
