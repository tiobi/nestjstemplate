import {
  ApiBadRequestResponse,
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

export class UserControllerGetUserSchemas {
  /**
   * Combined Swagger decorator for the get user by ID endpoint
   * Includes operation, parameters, and all response schemas
   */
  static getUserDecorators = () => {
    return (
      target: object,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) => {
      ApiOperation({
        summary: 'Get user by ID',
        description:
          'Retrieves a specific user by their unique identifier (ULID format).',
      })(target, propertyKey, descriptor);

      ApiParam(CommonApiSchemas.ulidParamSchema)(
        target,
        propertyKey,
        descriptor,
      );

      ApiResponse({
        status: 200,
        description: 'User successfully retrieved',
        schema: UserDataSchemas.singleUserResponseSchema,
      })(target, propertyKey, descriptor);

      ApiBadRequestResponse({
        description: 'Invalid user ID format',
        schema: ErrorResponseSchemas.validationErrorSchema,
      })(target, propertyKey, descriptor);

      ApiNotFoundResponse({
        description: 'User not found',
        schema: ErrorResponseSchemas.notFoundErrorSchema,
      })(target, propertyKey, descriptor);

      ApiInternalServerErrorResponse({
        description: 'Internal server error',
        schema: ErrorResponseSchemas.internalServerErrorSchema,
      })(target, propertyKey, descriptor);
    };
  };
}
