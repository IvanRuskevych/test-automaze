import { Prisma, Task } from '@prisma/client';
import { prismaClient } from '~/prisma/client.js';

export const taskRepository = {
  create(input: Prisma.TaskCreateInput, args?: Omit<Prisma.TaskCreateArgs, 'data'>): Promise<Task> {
    return prismaClient.task.create({
      data: input,
      ...args,
    });
  },

  delete(taskId: string): Promise<Task> {
    return prismaClient.task.delete({
      where: { id: taskId },
    });
  },

  findById(taskId: string, args?: Omit<Prisma.TaskFindUniqueArgs, 'where'>): Promise<Task> {
    return prismaClient.task.findUniqueOrThrow({
      where: { id: taskId },
      ...args,
    });
  },

  findMany(args?: Prisma.TaskFindManyArgs): Promise<Task[]> {
    return prismaClient.task.findMany({ ...args });
  },

  update(
    taskId: string,
    data: Prisma.TaskUpdateInput,
    args?: Omit<Prisma.TaskUpdateArgs, 'where' | 'data'>,
  ): Promise<Task> {
    return prismaClient.task.update({
      where: { id: taskId },
      data,
      ...args,
    });
  },
};
