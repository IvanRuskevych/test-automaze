import {
  MutationCreateCategoryArgs,
  MutationDeleteCategoryArgs,
  MutationUpdateCategoryArgs,
  QueryGetCategoryArgs,
} from '~/graphql/generated/graphql.js';
import { categoryService } from '~/services/category.service.js';

export const categoryResolvers = {
  Query: {
    getCategory: async (_p: unknown, args: QueryGetCategoryArgs) => categoryService.getCategory(args),
    getCategories: async () => categoryService.getCategories(),
  },

  Mutation: {
    createCategory: async (_p: unknown, args: MutationCreateCategoryArgs) => categoryService.createCategory(args),
    updateCategory: async (_p: unknown, args: MutationUpdateCategoryArgs) => categoryService.updateCategory(args),
    deleteCategory: async (_p: unknown, args: MutationDeleteCategoryArgs) => categoryService.deleteCategory(args),
  },
};
