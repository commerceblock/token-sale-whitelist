

// imports
import { isEmpty, conforms, isString } from 'lodash';
import { createHmac } from 'crypto';

// local imports
import {
  hex_encoding,
  sha256_hash,
} from '../model/consts';


export const isEventPredicate = conforms({
  type: isString,
});

export function isValid(param) {
  return isString(param) && !isEmpty(param) && param.length <= 300;
}

export function isNotValid(param) {
  return !isValid(param);
}

// Event FQN: event fully qualified name
export function formatEventFQN(event) {
  return `${event.address}/${event.type}/${event.event_id}`;
}
