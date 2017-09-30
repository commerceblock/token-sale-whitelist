/* @flow */

import {
  GraphQLObjectType,
} from 'graphql';
import AddressType from '../types/address';
import AddressInputType from '../types/address-input';
import db from '../database';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createAddress: {
      type: AddressType,
      description: 'Create a new address',
      args: {
        addressInput: { type: AddressInputType },
      },
      resolve: (value, { addressInput }, context) => db.createAddress(addressInput),
    },
  }),
});

export default MutationType;
