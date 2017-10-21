/* @flow */

import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import AddressInputType from './address-input';
import db from '../database';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createAddress: {
      type: GraphQLString,
      description: 'Create a new address',
      args: {
        addressInput: { type: AddressInputType },
      },
      resolve: (value, { addressInput }, context) => db.createAddress(addressInput),
    },
  }),
});

export default MutationType;
