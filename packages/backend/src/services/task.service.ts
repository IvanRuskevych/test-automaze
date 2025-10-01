import { Prisma } from '@prisma/client';
import {
  MutationCreateTaskArgs,
  MutationDeleteTaskArgs,
  MutationMarkTaskDoneArgs,
  MutationUpdateTaskArgs,
  QueryGetTaskArgs,
  QueryGetTasksArgs,
} from '~/graphql/generated/graphql.js';
import { tasksRepository } from '~/repositories/index.js';
import { getEntityOrFail, validateInput } from '~/utils/index.js';
import { TaskUpdateSchema, UuidSchema } from '~/validation/index.js';
import { TaskCreateSchema } from '~/validation/task.schema.js';

export const taskService = {
  getTask: async (args: QueryGetTaskArgs) => {
    const { taskId } = args;

    validateInput(UuidSchema, { id: taskId });
    await getEntityOrFail(tasksRepository, taskId, 'Task not found');

    return tasksRepository.findById(taskId, { include: { category: true } });
  },

  getTasks: async (args: QueryGetTasksArgs) => {
    const { filter, orderBy, skip, take } = args;

    const where: Prisma.TaskWhereInput = {
      ...(filter?.status && filter.status !== 'all' && { isDone: filter.status === 'done' }),
      ...(filter?.categoryId && { categoryId: filter.categoryId }),
      ...(filter?.search && {
        OR: [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
      ...(filter?.priority && {
        priority: {
          ...(filter.priority?.min !== null && { gte: filter.priority.min }),
          ...(filter.priority?.max !== null && { lte: filter.priority.max }),
        },
      }),
    };

    const order: Prisma.TaskOrderByWithRelationInput = orderBy
      ? { [orderBy.field]: orderBy.direction as Prisma.SortOrder }
      : { createdAt: 'desc' };

    return tasksRepository.findManyWithFilters(where, order, skip ?? undefined, take ?? undefined, {
      include: { category: true },
    });
  },

  createTask: async (args: MutationCreateTaskArgs) => {
    const validatedInput = validateInput(TaskCreateSchema, args.input);
    return tasksRepository.create(validatedInput);
  },

  updateTask: async (args: MutationUpdateTaskArgs) => {
    const { taskId, input } = args;

    validateInput(UuidSchema, { id: taskId });
    await getEntityOrFail(tasksRepository, args.taskId, 'Task not found');

    const validatedInput = validateInput(TaskUpdateSchema, input);
    return tasksRepository.update(taskId, validatedInput);
  },

  deleteTask: async (args: MutationDeleteTaskArgs) => {
    const { taskId } = args;

    validateInput(UuidSchema, { id: taskId });
    await getEntityOrFail(tasksRepository, taskId, 'Task not found');

    return tasksRepository.delete(taskId);
  },

  markTaskDone: async (args: MutationMarkTaskDoneArgs) => {
    const { taskId, input } = args;

    validateInput(UuidSchema, { id: taskId });
    await getEntityOrFail(tasksRepository, taskId, 'Task not found');

    const validatedInput = validateInput(TaskUpdateSchema, input);
    return tasksRepository.update(taskId, validatedInput);
  },
};
