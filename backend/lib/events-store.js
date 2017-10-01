// imports
import { sortBy } from 'lodash';

// local imports
import Event from '../model/event';
import { columns } from '../model/consts';
import { formatEventFQN } from './item-util';

// logging
import { createLogger } from 'bunyan';

const log = createLogger({ name: 'events-store' });

export function saveEvent(payload) {
  return new Promise((resolve, reject) => {
    try {
      const event = new Event(payload);
      event.save((error) => {
        if (error) {
          log.error({
            error,
            payload,
          }, 'failed to save event');
          reject({
            error,
            payload,
          });
        } else {
          log.info(`event saved, prn: ${formatEventFQN(payload)}`);
          resolve(payload);
        }
      });
    } catch (error) {
      log.error({
        error,
        payload,
      }, 'an error occurred while saving event');
      reject({
        error,
        payload,
      });
    }
  });
}

export function loadEvents(address) {
  return new Promise((resolve, reject) => {
    Event.query(columns.address)
      .eq(address)
      .consistent()
      .exec((error, events) => {
        if (error) {
          reject({
            address,
            error,
          });
        } else {
          const sortedEvents = sortBy(events, [columns.timestamp]);
          resolve(sortedEvents);
        }
      });
  });
}
