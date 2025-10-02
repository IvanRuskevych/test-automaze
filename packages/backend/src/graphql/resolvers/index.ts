import { mergeResolvers } from '@graphql-tools/merge';
import { categoryResolvers } from '~/graphql/resolvers/category.resolvers.js';
import { taskResolvers } from '~/graphql/resolvers/task.resolvers.js';

export const resolvers = mergeResolvers([taskResolvers, categoryResolvers]);
