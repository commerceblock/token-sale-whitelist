import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat
} from 'graphql';

const AddressInputType = new GraphQLInputObjectType({
  name: 'AddressInput',
  description: 'A address input object',
  fields: () => ({
    address: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'address (btc or eth)',
    },
    amount: {
      type: GraphQLFloat,
      description: 'amount in usd',
    },
    refId: {
      type: GraphQLString,
      description: 'Reference id',
    },
  }),
});

export default AddressInputType;
