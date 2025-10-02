import { GraphQLError } from 'graphql';
import { ErrorCatalog } from '~/utils/errors/ErrorCatalog.js';

export function createGraphQLError(
  message: string = ErrorCatalog.INTERNAL_SERVER_ERROR.message,
  status: number = ErrorCatalog.INTERNAL_SERVER_ERROR.status,
  code: string = ErrorCatalog.INTERNAL_SERVER_ERROR.code,
  details?: Record<string, string[]>,
): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      code,
      status,
      ...(details ? { details } : {}),
    },
  });
}
