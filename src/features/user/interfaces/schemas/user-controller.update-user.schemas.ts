import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CommonApiSchemas,
  ErrorResponseSchemas,
  UserDataSchemas,
} from '../../../../common/schemas';
import { UpdateUserRequestDto } from '../dto/update-user.request.dto';

export class UserControllerUpdateUserSchemas {
  static userIdParamSchema = {
    name: 'id',
    description: 'User ID in ULID format',
    example: '01K49Y9P75B9NB6W15VZ37YV6B',
    schema: {
      type: 'string',
      pattern: '^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$',
    },
  };

  static updateUserRequestSchema = {
    type: UpdateUserRequestDto,
    description: 'User update request data',
    examples: {
      'update-email': {
        summary: 'Update email only',
        description: 'Update user email address',
        value: {
          email: 'newemail@example.com',
        },
      },
      'update-username': {
        summary: 'Update username only',
        description: 'Update username',
        value: {
          username: 'newusername',
        },
      },
      'update-both': {
        summary: 'Update both email and username',
        description: 'Update both email and username',
        value: {
          email: 'updated@example.com',
          username: 'updateduser',
        },
      },
    },
  };

  /**
   * Combined Swagger decorator for the update user endpoint
   * Includes operation, parameters, request body, and all response schemas
   */
  static updateUserDecorators = () => {
    return (
      target: object,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) => {
      ApiOperation({
        summary: 'Update user by ID',
        description:
          'Updates a user with new email and/or username. At least one field must be provided.',
      })(target, propertyKey, descriptor);

      ApiParam(CommonApiSchemas.ulidParamSchema)(
        target,
        propertyKey,
        descriptor,
      );

      ApiBody(UserControllerUpdateUserSchemas.updateUserRequestSchema)(
        target,
        propertyKey,
        descriptor,
      );

      ApiResponse({
        status: 200,
        description: 'User successfully updated',
        schema: UserDataSchemas.singleUserResponseSchema,
      })(target, propertyKey, descriptor);

      ApiBadRequestResponse({
        description: 'Invalid input data or validation failed',
        schema: ErrorResponseSchemas.validationErrorSchema,
      })(target, propertyKey, descriptor);

      ApiNotFoundResponse({
        description: 'User not found',
        schema: ErrorResponseSchemas.notFoundErrorSchema,
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
