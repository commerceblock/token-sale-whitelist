/* @flow */
import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import AddressInputType from './address-input';
import ApplicationType from './application';
import ApplicationInputType from './application-input';
import FileType from './file';
import FileInputType from './file-input';
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
    createApplication: {
      type: ApplicationType,
      description: 'Create a new application',
      args: {
        input: { type: ApplicationInputType },
      },
      resolve: (value, { input }, context) => db.createApplication(input),
    },
    saveFile: {
      type: FileType,
      description: 'Save a new file',
      args: {
        input: { type: FileInputType },
      },
      resolve: (value, { input }, context) => db.saveFile(input),
    },
  }),
});

export default MutationType;
