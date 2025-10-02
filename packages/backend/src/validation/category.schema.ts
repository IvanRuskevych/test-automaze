import { z } from 'zod';

const CategorySchema = {
  name: z
    .string({
      invalid_type_error: 'Category must be a string',
    })
    .min(3, { message: 'Category must be at least 3 characters long' })
    .max(100, { message: 'Category must not exceed 100 characters' }),
};

export const CategoryCreateSchema = z.object(CategorySchema);
export const CategoryUpdateSchema = CategoryCreateSchema.partial();

export type CategoryCreateSchemaType = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateSchemaType = z.infer<typeof CategoryUpdateSchema>;
