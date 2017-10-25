import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import AddressType from '../types/address';
import ApplicationType from '../types/application';
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
      resolve: (parent, { address }, context) => db.listAddress(address),
    },
    listApplication: {
      type: ApplicationType,
      args: {
        address: { type: GraphQLString },
      },
      resolve: (parent, { address }, context) => db.listApplication(address),
    },
  }),
});

export default QueryType;
