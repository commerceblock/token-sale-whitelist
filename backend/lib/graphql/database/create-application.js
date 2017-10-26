// local imports
import { loadEvents, saveEvent } from '../../events-store';
import { createOrderedId } from '../../uuid';
import { event_type } from '../../../model/consts';
import { isEmpty, first, find } from 'lodash';

export default async (input) => {
  const address = input.address;
  return loadEvents(address)
    .then(events => {
      if (isEmpty(events)) {
        return null;
      }
      const data = {
        first_name: input.firstName,
        last_name: input.lastName,
        title: input.title,
        email: input.email,
        gender: input.gender,
        building_number: input.buildingNumber,
        street_name: input.streetName,
        postal_code: input.postalCode,
        city: input.city,
        country: input.country,
        passport_number: input.passportNumber,
        passport_file_key: input.passportFileKey,
      };
      const payload = {
        address,
        event_id: createOrderedId(),
        type: event_type.application_created,
        timestamp: new Date().toISOString(),
        data,
      };
      return saveEvent(payload);
    })
    .then(payload => {
      if (payload === null) {
        return {
          address,
          status: 'rejected',
        };
      }
      return {
        address,
        status: 'accepted',
      };
    });
};
