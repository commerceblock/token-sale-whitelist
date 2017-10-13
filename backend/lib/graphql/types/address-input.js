/* @flow */

import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

const AddressInputType = new GraphQLInputObjectType({
  name: 'AddressInput',
  description: 'A address input object',
  fields: () => ({
    address: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'address (btc or eth)',
    },
    refId: {
      type: GraphQLString,
      description: 'Reference id',
    },
  }),
});

export default AddressInputType;
