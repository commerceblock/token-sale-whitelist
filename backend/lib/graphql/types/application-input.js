/* @flow */

import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

const ApplicationInputType = new GraphQLInputObjectType({
  name: 'ApplicationInput',
  description: 'An application input object',
  fields: () => ({
    address: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    gender: {
      type: new GraphQLNonNull(GraphQLString),
    },
    buildingNumber: {
      type: new GraphQLNonNull(GraphQLString),
    },
    streetName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    postalCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
    },
    passportNumber: {
      type: new GraphQLNonNull(GraphQLString),
    },
    passportFileKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export default ApplicationInputType;
