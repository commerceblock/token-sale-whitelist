
// imports
import { find, isString } from 'lodash'

// local imports
import { loadEvents, saveEvent } from '../../../../lib/events-store';
import { createOrderedId } from '../../../../lib/uuid';
import { event_type, address_status } from '../../../../model/consts';
import { checkEthBtcAddress } from '../../../address-validator';

export default async (addressInput) => {
  const address = addressInput.address
  // if length > 50, we throw immediatelly
  if(isString(address) && address.length > 50) {
    throw "Address length is not valid."
  }

  // Otherwise, we go to check the address
  checkEthBtcAddress(address)

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
        const data = extractRefId(addressInput.refId);
        if (data) {
          payload.data = data;
        }
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

function extractRefId(refId) {
  if (isString(refId)) {
    return {
      ref_id: refId.substring(0, 50)
    };
  }
  return null;
}
