// imports
import { find } from 'lodash';

// local imports
import { event_type, address_status } from '../../../model/consts';
import { loadEvents } from '../../../lib/events-store';


export function resolveStatus(events) {
  const address_created = find(events, { type: event_type.address_created });
  if (address_created) {
    const address_verified = find(events, { type: event_type.address_verified });
    if (address_verified) {
      const isAccepted = address_verified.data && address_verified.data.status === address_status.accepted;
      return isAccepted ? address_status.accepted : address_status.rejected;
    }
    return address_status.pending;
  }
  return address_status.unknown;
}

export default async (address) => {
  return loadEvents(address)
    .then(events => {
      const status = resolveStatus(events);
      return {
        address,
        status,
      };
    });
}
