import { ApolloError } from '@apollo/client';

interface ErrorHandlerResult {
  fieldErrors: Record<string, string[]> | null;
  error: string | null;
}

export interface GraphQLErrorExtensions {
  code?: string;
  status?: number;
  details?: Record<string, string[]>;
}

export function handleApolloError(err: unknown): ErrorHandlerResult {
  // Check if the error is an instance of ApolloError (GraphQL-related)
  if (err instanceof ApolloError) {
    const graphQLErrors = err.graphQLErrors;

    // If there are GraphQL errors returned from the server
    if (graphQLErrors.length > 0) {
      const firstError = graphQLErrors[0];

      // Get any custom extensions (such as field validation details)
      const extensions = firstError.extensions as GraphQLErrorExtensions;

      // Extract field-level validation errors (if present)
      const details = extensions?.details ?? null;

      // Extract the main error message from the GraphQL error
      const message = firstError.message ?? 'Unexpected error';

      return {
        fieldErrors: details,
        // Return general message only if there are no field errors
        error: details ? null : message,
      };
    } else {
      // No detailed GraphQL errors; fallback to ApolloError message
      return {
        fieldErrors: null,
        error: err.message,
      };
    }
  }

  // Return general message
  return {
    fieldErrors: null,
    error: 'Unknown error occurred',
  };
}
