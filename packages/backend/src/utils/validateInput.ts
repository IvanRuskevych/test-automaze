import { ZodSchema } from 'zod';
import { ApiErrors } from '~/utils/errors/index.js';

export function validateInput<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const formatedErrors = result.error.flatten().fieldErrors;
    throw ApiErrors.BadRequest(formatedErrors as Record<string, string[]>);
  }

  return result.data;
}
