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
        description: `Retrieve a specific user by their unique identifier.

**Request Format:**
\`\`\`http
GET /api/users/01HZ123456789ABCDEFGHIJKLMN
\`\`\`

**Path Parameters:**
- \`id\` - User ID (ULID)

**Response Format:**
\`\`\`json
{
  "data": {
    "id": "01HZ123456789ABCDEFGHIJKLMN",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z",
    "deletedAt": null
  },
  "meta": {
    "timestamp": "2025-01-05T01:48:10.478Z",
    "path": "/api/users/01HZ123456789ABCDEFGHIJKLMN",
    "version": "1.0"
  }
}
\`\`\``,
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
