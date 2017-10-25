/* @flow */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

const ApplicationType = new GraphQLObjectType({
  name: 'Application',
  description: 'An application object',
  fields: () => ({
    address: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'address (btc or eth)',
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'order status (unknown, pending, accepted, rejected)',
    },
  }),
});

export default ApplicationType;
