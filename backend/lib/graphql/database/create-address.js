// imports
import { find, isString } from 'lodash';

// local imports
import { loadEvents, saveEvent } from '../../../lib/events-store';
import { createOrderedId } from '../../../lib/uuid';
import { event_type, address_status } from '../../../model/consts';
import { checkEthOrBtcAddress } from '../../address-validator';

const minAmount = 300;
const maxAmount = 11500;


export function extractRefId(refId) {
  return isString(refId) ? refId.substring(0, 50) : null;
}

export default async (addressInput) => {
  const address = addressInput.address;
  // if length > 50, we throw immediatelly
  if (isString(address) && address.length > 50) {
    throw new Error('Address length is not valid.');
  }

  const amount = addressInput.amount;
  if (amount < minAmount || amount > maxAmount) {
    throw new Error(`Amount is not valid, please enter an amount between $${minAmount.toFixed(2)} - $${maxAmount.toFixed(2)}`);
  }

  // Otherwise, we go to check the address
  checkEthOrBtcAddress(address);

  return loadEvents(address)
    .then(events => {
      const address_created = find(events, { type: event_type.address_created });
      if (!address_created) {
        const payload = {
          address,
          event_id: createOrderedId(),
          type: event_type.address_created,
          timestamp: new Date().toISOString(),
          data: {
            ref_id: extractRefId(addressInput.refId),
            amount,
          },
        };
        return saveEvent(payload);
      }
      return address_created;
    })
    .then(() => address);
};
