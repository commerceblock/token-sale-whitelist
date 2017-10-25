// imports
import { find } from 'lodash';

// local imports
import { event_type, application_status, address_status } from '../../../model/consts';
import { loadEvents } from '../../events-store';


export function resolveStatus(events) {
  const address_created = find(events, { type: event_type.address_created });
  const address_verified = find(events, { type: event_type.address_verified });
  const application_created = find(events, { type: event_type.application_created });

  if (application_created) {
    return application_status.pending;
  } else if (address_verified) {
    const isAccepted = address_verified.data && address_verified.data.status === address_status.accepted;
    return isAccepted ? application_status.open : application_status.rejected;
  } else if (address_created) {
    return application_status.close;
  }
  return application_status.unknown;
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
};
