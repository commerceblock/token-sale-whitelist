import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import AddressType from '../types/address';
import db from '../database';

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    listAddress: {
      type: AddressType,
      args: {
        address: { type: GraphQLString },
      },
      resolve: (parent, { address }, context) => db.getAddress(address),
    }
  }),
});

export default QueryType;
