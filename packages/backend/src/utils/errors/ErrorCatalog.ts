export const ErrorCatalog = {
  BAD_REQUEST: { code: 'BAD_REQUEST', message: 'Bad request', status: 400 },
  UNAUTHENTICATED: { code: 'UNAUTHENTICATED', message: 'Unauthorized', status: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', message: 'Forbidden', status: 403 },
  NOT_FOUND: { code: 'NOT_FOUND', message: 'Not found', status: 404 },
  CONFLICT: { code: 'CONFLICT', message: 'Conflict', status: 409 },
  UNPROCESSABLE_ENTITY: { code: 'UNPROCESSABLE_ENTITY', message: 'Unprocessable entity', status: 422 },
  INTERNAL_SERVER_ERROR: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error', status: 500 },
} as const;
