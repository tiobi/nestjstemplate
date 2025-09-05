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
        description: `Soft delete a user by their unique identifier.

**Request Format:**
\`\`\`http
DELETE /api/users/01HZ123456789ABCDEFGHIJKLMN
\`\`\`

**Path Parameters:**
- \`id\` - User ID (ULID)

**Response Format:**
\`\`\`json
{
  "data": {
    "id": "01HZ123456789ABCDEFGHIJKLMN",
    "deletedAt": "2025-01-05T01:48:10.478Z"
  },
  "meta": {
    "timestamp": "2025-01-05T01:48:10.478Z",
    "path": "/api/users/01HZ123456789ABCDEFGHIJKLMN"
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
