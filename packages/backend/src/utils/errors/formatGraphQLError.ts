import { GraphQLFormattedError } from 'graphql';

export function formatGraphQLError(formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError {
  // eslint-disable-next-line no-console
  console.error('GraphQL error:', error);

  if (typeof formattedError.extensions?.code === 'string' && typeof formattedError.extensions?.status === 'number') {
    return formattedError;
  }

  return {
    ...formattedError,
    extensions: {
      ...formattedError.extensions,
      code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
      status: formattedError.extensions?.status || 500,
    },
  };
}
