import { CommonApiSchemas } from './common-api.schemas';

/**
 * Standardized error response schemas for all API endpoints
 */
export class ErrorResponseSchemas {
  /**
   * Base error object structure
   */
  private static baseErrorObject = {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'Error code identifying the type of error',
      },
      message: {
        type: 'string',
        description: 'Human-readable error message',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'ISO 8601 timestamp when the error occurred',
      },
    },
    required: ['code', 'message', 'timestamp'],
  };

  /**
   * Base error response structure
   */
  private static baseErrorResponse = {
    type: 'object',
    properties: {
      error: ErrorResponseSchemas.baseErrorObject,
      meta: CommonApiSchemas.metaSchema,
    },
    required: ['error', 'meta'],
  };

  /**
   * Validation error response schema
   */
  static validationErrorSchema = {
    ...ErrorResponseSchemas.baseErrorResponse,
    properties: {
      ...ErrorResponseSchemas.baseErrorResponse.properties,
      error: {
        ...ErrorResponseSchemas.baseErrorObject,
        properties: {
          ...ErrorResponseSchemas.baseErrorObject.properties,
          code: {
            ...ErrorResponseSchemas.baseErrorObject.properties.code,
            example: 'VALIDATION_ERROR',
          },
          message: {
            ...ErrorResponseSchemas.baseErrorObject.properties.message,
            example: 'Invalid input data',
          },
          timestamp: {
            ...ErrorResponseSchemas.baseErrorObject.properties.timestamp,
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    },
  };

  /**
   * Not found error response schema
   */
  static notFoundErrorSchema = {
    ...ErrorResponseSchemas.baseErrorResponse,
    properties: {
      ...ErrorResponseSchemas.baseErrorResponse.properties,
      error: {
        ...ErrorResponseSchemas.baseErrorObject,
        properties: {
          ...ErrorResponseSchemas.baseErrorObject.properties,
          code: {
            ...ErrorResponseSchemas.baseErrorObject.properties.code,
            example: 'USER_NOT_FOUND',
          },
          message: {
            ...ErrorResponseSchemas.baseErrorObject.properties.message,
            example: 'User with id 01K49Y9P75B9NB6W15VZ37YV6B not found',
          },
          timestamp: {
            ...ErrorResponseSchemas.baseErrorObject.properties.timestamp,
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    },
  };

  /**
   * Conflict error response schema
   */
  static conflictErrorSchema = {
    ...ErrorResponseSchemas.baseErrorResponse,
    properties: {
      ...ErrorResponseSchemas.baseErrorResponse.properties,
      error: {
        ...ErrorResponseSchemas.baseErrorObject,
        properties: {
          ...ErrorResponseSchemas.baseErrorObject.properties,
          code: {
            ...ErrorResponseSchemas.baseErrorObject.properties.code,
            example: 'EMAIL_ALREADY_EXISTS',
          },
          message: {
            ...ErrorResponseSchemas.baseErrorObject.properties.message,
            example: 'Email already exists',
          },
          timestamp: {
            ...ErrorResponseSchemas.baseErrorObject.properties.timestamp,
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    },
  };

  /**
   * Internal server error response schema
   */
  static internalServerErrorSchema = {
    ...ErrorResponseSchemas.baseErrorResponse,
    properties: {
      ...ErrorResponseSchemas.baseErrorResponse.properties,
      error: {
        ...ErrorResponseSchemas.baseErrorObject,
        properties: {
          ...ErrorResponseSchemas.baseErrorObject.properties,
          code: {
            ...ErrorResponseSchemas.baseErrorObject.properties.code,
            example: 'INTERNAL_ERROR',
          },
          message: {
            ...ErrorResponseSchemas.baseErrorObject.properties.message,
            example: 'Internal server error',
          },
          timestamp: {
            ...ErrorResponseSchemas.baseErrorObject.properties.timestamp,
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    },
  };
}
