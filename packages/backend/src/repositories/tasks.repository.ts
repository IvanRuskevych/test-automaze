import { Prisma, Task } from '@prisma/client';
import { TaskCreateInput } from '~/graphql/generated/graphql.js';
import { prismaClient } from '~/prisma/client.js';

export const tasksRepository = {
  create: (input: TaskCreateInput, args?: Omit<Prisma.TaskCreateArgs, 'data'>): Promise<Task> => {
    const data: Prisma.TaskCreateInput = {
      title: input.title,
      description: input.description,
      priority: input.priority || undefined,
      ...(input.categoryId && { category: { connect: { id: input.categoryId } } }),
    };

    return prismaClient.task.create({
      data,
      ...args,
    });
  },

  delete: (taskId: string): Promise<Task> => {
    return prismaClient.task.delete({
      where: { id: taskId },
    });
  },

  findById: (taskId: string, args?: Omit<Prisma.TaskFindUniqueArgs, 'where'>): Promise<Task> => {
    return prismaClient.task.findUniqueOrThrow({
      where: { id: taskId },
      ...args,
    });
  },

  findManyWithFilters: (
    where: Prisma.TaskWhereInput,
    orderBy?: Prisma.TaskOrderByWithRelationInput,
    skip?: number,
    take?: number,
    args?: Omit<Prisma.TaskFindManyArgs, 'where' | 'orderBy' | 'skip' | 'take'>,
  ): Promise<Task[]> => {
    return prismaClient.task.findMany({ where, orderBy, skip, take, ...args });
  },

  update: (
    taskId: string,
    data: Prisma.TaskUpdateInput,
    args?: Omit<Prisma.TaskUpdateArgs, 'where' | 'data'>,
  ): Promise<Task> => {
    return prismaClient.task.update({
      where: { id: taskId },
      data,
      ...args,
    });
  },
};
