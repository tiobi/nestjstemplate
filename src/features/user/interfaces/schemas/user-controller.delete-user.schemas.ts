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
} from 'src/common/schemas';

export class UserControllerDeleteUserSchemas {
  /**
   * Combined Swagger decorator for the delete user endpoint
   * Includes operation, parameters, and all response schemas
   */
  static deleteUserDecorators = () => {
    return (
      target: object,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) => {
      ApiOperation({
        summary: 'Delete user by ID',
        description:
          'Soft deletes a user by their unique identifier (ULID format). The user will be marked as deleted but not permanently removed.',
      })(target, propertyKey, descriptor);

      ApiParam(CommonApiSchemas.ulidParamSchema)(
        target,
        propertyKey,
        descriptor,
      );

      ApiResponse({
        status: 200,
        description: 'User successfully deleted',
        schema: UserDataSchemas.userDeletionResponseSchema,
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
