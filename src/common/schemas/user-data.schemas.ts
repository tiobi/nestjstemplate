import { CommonApiSchemas } from './common-api.schemas';

/**
 * User-specific data schemas for API responses
 */
export class UserDataSchemas {
  /**
   * Standard user object schema
   */
  static userObjectSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '01K49Y9P75B9NB6W15VZ37YV6B',
        description: 'Unique identifier for the user',
      },
      email: {
        type: 'string',
        example: 'john.doe@example.com',
        format: 'email',
        description: 'User email address',
      },
      username: {
        type: 'string',
        example: 'johndoe',
        description: 'Username for the user',
      },
      createdAt: {
        type: 'string',
        example: '2025-09-04T08:43:08.901Z',
        format: 'date-time',
        description: 'Timestamp when the user was created',
      },
      updatedAt: {
        type: 'string',
        example: '2025-09-04T08:43:08.901Z',
        format: 'date-time',
        description: 'Timestamp when the user was last updated',
      },
      deletedAt: {
        type: 'string',
        example: null,
        format: 'date-time',
        nullable: true,
        description: 'Timestamp when the user was soft deleted',
      },
    },
    required: [
      'id',
      'email',
      'username',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  };

  /**
   * Single user response schema
   */
  static singleUserResponseSchema = {
    type: 'object',
    properties: {
      data: UserDataSchemas.userObjectSchema,
      meta: CommonApiSchemas.metaSchema,
    },
    required: ['data', 'meta'],
  };

  /**
   * Paginated users response schema
   */
  static paginatedUsersResponseSchema = {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: UserDataSchemas.userObjectSchema,
            description: 'Array of user objects',
          },
          pagination: CommonApiSchemas.paginationMetadataSchema,
        },
        required: ['users', 'pagination'],
      },
      meta: CommonApiSchemas.metaSchema,
    },
    required: ['data', 'meta'],
  };

  /**
   * User deletion success response schema
   */
  static userDeletionResponseSchema = {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User successfully deleted',
            description: 'Confirmation message',
          },
          userId: {
            type: 'string',
            example: '01K49Y9P75B9NB6W15VZ37YV6B',
            description: 'ID of the deleted user',
          },
        },
        required: ['message', 'userId'],
      },
      meta: CommonApiSchemas.metaSchema,
    },
    required: ['data', 'meta'],
  };
}
