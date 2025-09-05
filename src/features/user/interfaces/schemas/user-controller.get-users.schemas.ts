import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CommonApiSchemas,
  ErrorResponseSchemas,
  UserDataSchemas,
} from 'src/common/schemas';

export class UserControllerGetUsersSchemas {
  /**
   * Combined Swagger decorator for the get users with pagination endpoint
   * Includes operation, query parameters, and all response schemas
   */
  static getUsersDecorators = () => {
    return (
      target: object,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) => {
      ApiOperation({
        summary: 'Get paginated list of users',
        description:
          'Retrieves a paginated list of users with optional page and limit parameters.',
      })(target, propertyKey, descriptor);

      ApiQuery(CommonApiSchemas.pageQuerySchema)(
        target,
        propertyKey,
        descriptor,
      );

      ApiQuery(CommonApiSchemas.limitQuerySchema)(
        target,
        propertyKey,
        descriptor,
      );

      ApiResponse({
        status: 200,
        description: 'Users successfully retrieved',
        schema: UserDataSchemas.paginatedUsersResponseSchema,
      })(target, propertyKey, descriptor);

      ApiBadRequestResponse({
        description: 'Invalid pagination parameters',
        schema: ErrorResponseSchemas.validationErrorSchema,
      })(target, propertyKey, descriptor);

      ApiInternalServerErrorResponse({
        description: 'Internal server error',
        schema: ErrorResponseSchemas.internalServerErrorSchema,
      })(target, propertyKey, descriptor);
    };
  };
}
