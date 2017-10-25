/* @flow */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

const FileType = new GraphQLObjectType({
  name: 'File',
  description: 'A file object',
  fields: () => ({
    fileKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
    imageType: {
      type: new GraphQLNonNull(GraphQLString),
    },
    fileS3Url: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export default FileType;
