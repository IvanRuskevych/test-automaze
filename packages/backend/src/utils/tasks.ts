import { ApiErrors } from '~/utils/errors/index.js';

export async function getEntityOrFail<T>(
  repository: { findById: (id: string) => Promise<T | null> },
  id: string,
  notFoundMessage: string,
): Promise<T> {
  const entity = await repository.findById(id);
  if (!entity) throw ApiErrors.NotFound(notFoundMessage);

  return entity;
}
