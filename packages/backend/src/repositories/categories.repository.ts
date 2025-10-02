import { Category, Prisma } from '@prisma/client';
import { CategoryCreateInput } from '~/graphql/generated/graphql.js';
import { prismaClient } from '~/prisma/client.js';

export const categoriesRepository = {
  create: (input: CategoryCreateInput, args?: Omit<Prisma.CategoryCreateArgs, 'data'>): Promise<Category> => {
    return prismaClient.category.create({
      data: input,
      ...args,
    });
  },

  delete: (categoryId: string): Promise<Category> => {
    return prismaClient.category.delete({
      where: { id: categoryId },
    });
  },

  findById: (categoryId: string, args?: Omit<Prisma.CategoryFindUniqueArgs, 'where'>): Promise<Category> => {
    return prismaClient.category.findUniqueOrThrow({
      where: { id: categoryId },
      ...args,
    });
  },

  findMany: (args?: Prisma.CategoryFindManyArgs): Promise<Category[]> => {
    return prismaClient.category.findMany({ ...args });
  },

  update: (
    categoryId: string,
    data: Prisma.CategoryUpdateInput,
    args?: Omit<Prisma.CategoryUpdateArgs, 'where' | 'data'>,
  ): Promise<Category> => {
    return prismaClient.category.update({
      where: { id: categoryId },
      data,
      ...args,
    });
  },
};
