/* @flow */

import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

const FileInputType = new GraphQLInputObjectType({
  name: 'FileInput',
  description: 'A file input object',
  fields: () => ({
    fileName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    fileType: {
      type: new GraphQLNonNull(GraphQLString),
    },
    imageType: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }),
});

export default FileInputType;
