import { z } from 'zod';

const TaskSchema = {
  title: z
    .string({
      invalid_type_error: 'Title must be a string',
    })
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(100, { message: 'Title must not exceed 100 characters' }),

  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .max(255, { message: 'Description must not exceed 255 characters' })
    .optional(),

  isDone: z.boolean({ invalid_type_error: 'isDone must be a boolean' }).default(false),

  priority: z
    .number({ invalid_type_error: 'Priority must be a number' })
    .int({ message: 'Priority must be an integer' })
    .min(1, { message: 'Priority must be at least 1' })
    .max(10, { message: 'Priority must not exceed 10' })
    .optional()
    .default(5),

  categoryId: z.string().uuid({ message: 'CategoryId must be a valid UUID' }).optional(),
};

export const TaskCreateSchema = z.object(TaskSchema);
export const TaskUpdateSchema = TaskCreateSchema.partial();

export type TaskCreateSchemaType = z.infer<typeof TaskCreateSchema>;
export type TaskUpdateSchemaType = z.infer<typeof TaskUpdateSchema>;
