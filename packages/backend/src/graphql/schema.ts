import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from '~/graphql/resolvers/index.js';
import { typeDefs } from '~/graphql/typeDefs/index.js';

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
