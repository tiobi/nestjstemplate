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
        description: `Retrieve paginated list of users.

**Request Format:**
\`\`\`http
GET /api/users?page=1&limit=10
\`\`\`

**Query Parameters:**
- \`page\` - Page number (default: 1)
- \`limit\` - Items per page (default: 10, max: 100)

**Response Format:**
\`\`\`json
{
  "data": {
    "users": [
      {
        "id": "01HZ123456789ABCDEFGHIJKLMN",
        "email": "john.doe@example.com",
        "username": "johndoe",
        "createdAt": "2024-03-15T10:30:00.000Z",
        "updatedAt": "2024-03-15T10:30:00.000Z",
        "deletedAt": null
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "meta": {
    "timestamp": "2025-01-05T01:48:10.478Z",
    "path": "/api/users?page=1&limit=10",
    "version": "1.0"
  }
}
\`\`\``,
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
