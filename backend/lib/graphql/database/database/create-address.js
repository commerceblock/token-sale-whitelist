
// imports
import { find } from 'lodash'

// local imports
import { loadEvents, saveEvent } from '../../../../lib/events-store';
import { createOrderedId } from '../../../../lib/uuid';
import { event_type, address_status } from '../../../../model/consts';

export default async (addressInput) => {
  const address = addressInput.address
  return loadEvents(address)
    .then(events => {
      const address_created = find(events, { type: event_type.address_created });
      if (!address_created) {
        const payload = {
          address,
          event_id: createOrderedId(),
          type: event_type.address_created,
          timestamp: new Date().toISOString(),
        };
        return saveEvent(payload);
      } else {
        return address_created;
      }
    })
    .then(payload => ({
      address,
      status: address_status.pending
    }));
};
