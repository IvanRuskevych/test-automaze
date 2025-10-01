import { mergeResolvers } from '@graphql-tools/merge';
import { taskResolvers } from '~/graphql/resolvers/task.resolvers.js';

export const resolvers = mergeResolvers([taskResolvers]);
