import {
  MutationCreateCategoryArgs,
  MutationDeleteCategoryArgs,
  MutationUpdateCategoryArgs,
  QueryGetCategoryArgs,
} from '~/graphql/generated/graphql.js';
import { categoriesRepository } from '~/repositories/index.js';
import { getEntityOrFail, validateInput } from '~/utils/index.js';
import { CategoryCreateSchema, CategoryUpdateSchema, UuidSchema } from '~/validation/index.js';

export const categoryService = {
  getCategory: async (args: QueryGetCategoryArgs) => {
    validateInput(UuidSchema, { id: args.categoryId });
    return await categoriesRepository.findById(args.categoryId);
  },

  getCategories: async () => {
    return categoriesRepository.findMany();
  },

  createCategory: async (args: MutationCreateCategoryArgs) => {
    const validatedInput = validateInput(CategoryCreateSchema, args.input);
    return categoriesRepository.create(validatedInput);
  },

  updateCategory: async (args: MutationUpdateCategoryArgs) => {
    const { categoryId, input } = args;

    validateInput(UuidSchema, { id: categoryId });
    await getEntityOrFail(categoriesRepository, categoryId, 'Category not found');
    const validatedInput = validateInput(CategoryUpdateSchema, input);
    return categoriesRepository.update(categoryId, validatedInput);
  },

  deleteCategory: async (args: MutationDeleteCategoryArgs) => {
    const { categoryId } = args;

    validateInput(UuidSchema, { id: categoryId });
    await getEntityOrFail(categoriesRepository, categoryId, 'Category not found');

    return categoriesRepository.delete(categoryId);
  },
};
