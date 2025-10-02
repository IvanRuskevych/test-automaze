import {
  MutationCreateTaskArgs,
  MutationDeleteTaskArgs,
  MutationMarkTaskDoneArgs,
  MutationUpdateTaskArgs,
  QueryGetTaskArgs,
  QueryGetTasksArgs,
} from '~/graphql/generated/graphql.js';
import { taskService } from '~/services/index.js';

export const taskResolvers = {
  Query: {
    getTask: async (_p: unknown, args: QueryGetTaskArgs) => taskService.getTask(args),
    getTasks: async (_p: unknown, args: QueryGetTasksArgs) => taskService.getTasks(args),
  },

  Mutation: {
    createTask: async (_p: unknown, args: MutationCreateTaskArgs) => taskService.createTask(args),
    updateTask: async (_p: unknown, args: MutationUpdateTaskArgs) => taskService.updateTask(args),
    deleteTask: async (_p: unknown, args: MutationDeleteTaskArgs) => taskService.deleteTask(args),
    markTaskDone: async (_p: unknown, args: MutationMarkTaskDoneArgs) => taskService.markTaskDone(args),
  },
};
