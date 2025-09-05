import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponseSchemas, UserDataSchemas } from 'src/common/schemas';
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
        schema: UserDataSchemas.singleUserResponseSchema,
      })(target, propertyKey, descriptor);

      ApiBadRequestResponse({
        description: 'Invalid input data or validation failed',
        schema: ErrorResponseSchemas.validationErrorSchema,
      })(target, propertyKey, descriptor);

      ApiConflictResponse({
        description: 'Email already exists',
        schema: ErrorResponseSchemas.conflictErrorSchema,
      })(target, propertyKey, descriptor);

      ApiInternalServerErrorResponse({
        description: 'Internal server error',
        schema: ErrorResponseSchemas.internalServerErrorSchema,
      })(target, propertyKey, descriptor);
    };
  };
}
