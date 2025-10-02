import { createGraphQLError } from '~/utils/errors/createGraphQLError.js';
import { ErrorCatalog } from '~/utils/errors/ErrorCatalog.js';

const { BAD_REQUEST, UNAUTHENTICATED, FORBIDDEN, NOT_FOUND, CONFLICT, UNPROCESSABLE_ENTITY } = ErrorCatalog;

export const ApiErrors = {
  BadRequest: (message: string | Record<string, string[]> = BAD_REQUEST.message) =>
    typeof message === 'string'
      ? createGraphQLError(message, BAD_REQUEST.status, BAD_REQUEST.code)
      : createGraphQLError('Invalid input', BAD_REQUEST.status, BAD_REQUEST.code),

  Unauthorized: (message: string = UNAUTHENTICATED.message) =>
    createGraphQLError(message, UNAUTHENTICATED.status, UNAUTHENTICATED.code),

  Forbidden: (message: string = FORBIDDEN.message) => createGraphQLError(message, FORBIDDEN.status, FORBIDDEN.code),

  NotFound: (message: string = NOT_FOUND.message) => createGraphQLError(message, NOT_FOUND.status, NOT_FOUND.code),

  Conflict: (message: string = CONFLICT.message) => createGraphQLError(message, CONFLICT.status, CONFLICT.code),

  UnprocessableEntity: (message: string = UNPROCESSABLE_ENTITY.message) =>
    createGraphQLError(message, UNPROCESSABLE_ENTITY.status, UNPROCESSABLE_ENTITY.code),
};
