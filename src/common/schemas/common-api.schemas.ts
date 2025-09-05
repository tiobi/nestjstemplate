/**
 * Common API schema components shared across all endpoints
 */
export class CommonApiSchemas {
  /**
   * Standard ULID parameter schema for user ID
   */
  static ulidParamSchema = {
    name: 'id',
    description: 'User ID in ULID format',
    example: '01K49Y9P75B9NB6W15VZ37YV6B',
    schema: {
      type: 'string',
      pattern: '^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$',
    },
  };

  /**
   * Standard meta object schema for all API responses
   */
  static metaSchema = {
    type: 'object',
    properties: {
      timestamp: {
        type: 'string',
        example: '2025-09-05T10:15:22.470Z',
        format: 'date-time',
        description: 'ISO 8601 timestamp of the response',
      },
      path: {
        type: 'string',
        example: '/api/users',
        description: 'API endpoint path',
      },
      version: {
        type: 'string',
        example: '1.0',
        description: 'API version',
      },
    },
    required: ['timestamp', 'path', 'version'],
  };

  /**
   * Pagination query parameter schemas
   */
  static pageQuerySchema = {
    name: 'page',
    description: 'Page number for pagination (starts from 1)',
    required: false,
    example: 1,
    schema: {
      type: 'integer',
      minimum: 1,
      default: 1,
    },
  };

  static limitQuerySchema = {
    name: 'limit',
    description: 'Number of items per page (maximum 100)',
    required: false,
    example: 10,
    schema: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 10,
    },
  };

  /**
   * Standard pagination metadata schema
   */
  static paginationMetadataSchema = {
    type: 'object',
    properties: {
      total: {
        type: 'integer',
        example: 150,
        description: 'Total number of items',
      },
      page: {
        type: 'integer',
        example: 1,
        description: 'Current page number',
      },
      limit: {
        type: 'integer',
        example: 10,
        description: 'Number of items per page',
      },
      totalPages: {
        type: 'integer',
        example: 15,
        description: 'Total number of pages',
      },
    },
    required: ['total', 'page', 'limit', 'totalPages'],
    description: 'Pagination metadata',
  };
}
