import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';

export class UserControllerCreateUserSchemas {
  static createUserRequestSchema = {
    type: CreateUserRequestDto,
    description: 'User creation request data',
    examples: {
      'basic-user': {
        summary: 'Basic user creation',
        description: 'Create a user with email and username',
        value: {
          email: 'john.doe@example.com',
          username: 'johndoe',
        },
      },
      'email-only': {
        summary: 'Email only user',
        description:
          'Create a user with email only (username will be generated)',
        value: {
          email: 'jane.smith@example.com',
        },
      },
    },
  };

  static validationErrorSchema = {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'VALIDATION_ERROR',
            description: 'Error code identifying the type of validation error',
          },
          message: {
            type: 'string',
            example: 'Username must be between 3 and 20 characters',
            description: 'Human-readable error message',
          },
          timestamp: {
            type: 'string',
            example: '2024-01-01T00:00:00.000Z',
            format: 'date-time',
            description: 'ISO 8601 timestamp when the error occurred',
          },
        },
        required: ['code', 'message', 'timestamp'],
      },
      meta: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'string',
            example: '2024-01-01T00:00:00.000Z',
            format: 'date-time',
            description: 'ISO 8601 timestamp of the response',
          },
          path: {
            type: 'string',
            example: '/api/users',
            description: 'API endpoint path where the error occurred',
          },
          version: {
            type: 'string',
            example: '1.0',
            description: 'API version',
          },
        },
        required: ['timestamp', 'path', 'version'],
      },
    },
    required: ['error', 'meta'],
  };

  static conflictErrorSchema = {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'EMAIL_ALREADY_EXISTS',
            description: 'Error code identifying the conflict',
          },
          message: {
            type: 'string',
            example: 'Email already exists',
            description: 'Human-readable error message',
          },
          timestamp: {
            type: 'string',
            example: '2024-01-01T00:00:00.000Z',
            format: 'date-time',
            description: 'ISO 8601 timestamp when the error occurred',
          },
        },
        required: ['code', 'message', 'timestamp'],
      },
      meta: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'string',
            example: '2024-01-01T00:00:00.000Z',
            format: 'date-time',
            description: 'ISO 8601 timestamp of the response',
          },
          path: {
            type: 'string',
            example: '/api/users',
            description: 'API endpoint path where the error occurred',
          },
          version: {
            type: 'string',
            example: '1.0',
            description: 'API version',
          },
        },
        required: ['timestamp', 'path', 'version'],
      },
    },
    required: ['error', 'meta'],
  };

  static internalServerErrorSchema = {
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'INTERNAL_ERROR',
            description: 'Error code identifying the internal server error',
          },
          message: {
            type: 'string',
            example: 'Internal server error',
            description: 'Human-readable error message',
          },
          timestamp: {
            type: 'string',
            example: '2024-01-01T00:00:00.000Z',
            format: 'date-time',
            description: 'ISO 8601 timestamp when the error occurred',
          },
        },
        required: ['code', 'message', 'timestamp'],
      },
      meta: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'string',
            example: '2024-01-01T00:00:00.000Z',
            format: 'date-time',
            description: 'ISO 8601 timestamp of the response',
          },
          path: {
            type: 'string',
            example: '/api/users',
            description: 'API endpoint path where the error occurred',
          },
          version: {
            type: 'string',
            example: '1.0',
            description: 'API version',
          },
        },
        required: ['timestamp', 'path', 'version'],
      },
    },
    required: ['error', 'meta'],
  };

  static successResponseSchema = {
    type: 'object',
    properties: {
      data: {
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
      },
      meta: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'string',
            example: '2025-09-04T08:43:08.915Z',
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
      },
    },
    required: ['data', 'meta'],
  };

  /**
   * Combined Swagger decorator for the create user endpoint
   * Includes operation, request body, and all response schemas
   */
  static createUserDecorators = () => {
    return (
      target: object,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) => {
      ApiOperation({
        summary: 'Create a new user',
        description:
          'Creates a new user account with email and optional username. Username must not contain reserved words.',
      })(target, propertyKey, descriptor);

      ApiBody(UserControllerCreateUserSchemas.createUserRequestSchema)(
        target,
        propertyKey,
        descriptor,
      );

      ApiResponse({
        status: 201,
        description: 'User successfully created',
        schema: UserControllerCreateUserSchemas.successResponseSchema,
      })(target, propertyKey, descriptor);

      ApiBadRequestResponse({
        description: 'Invalid input data or validation failed',
        schema: UserControllerCreateUserSchemas.validationErrorSchema,
      })(target, propertyKey, descriptor);

      ApiConflictResponse({
        description: 'Email already exists',
        schema: UserControllerCreateUserSchemas.conflictErrorSchema,
      })(target, propertyKey, descriptor);

      ApiInternalServerErrorResponse({
        description: 'Internal server error',
        schema: UserControllerCreateUserSchemas.internalServerErrorSchema,
      })(target, propertyKey, descriptor);
    };
  };
}
