
// imports
import {
  find,
  size,
  filter
} from 'lodash'

// local imports
import {
  event_type,
  address_status
} from '../../../../model/consts'
import { loadEvents } from '../../../../lib/events-store';

export default async (address) => {
  return loadEvents(address)
    .then(events => {
      const status = resolveStatus(events);
      return {
        address,
        status,
      };
    });
};

export function resolveStatus(events) {
  const address_created = find(events, { type: event_type.address_created });
  if (address_created) {
    const address_verified = find(events, { type: event_type.address_verified });
    if (address_verified) {
      const approved = address_verified.data && address_verified.data.status === 'passed'
      return approved ? address_status.accepted : address_status.rejected;
    } else {
      return address_status.pending;
    }
  } else {
    return address_status.unknown;
  }
}
