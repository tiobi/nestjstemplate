import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponseSchemas, UserDataSchemas } from 'src/common/schemas';
import { UpdateUserRequestDto } from '../dto/update-user.request.dto';

export class UserControllerUpdateUserSchemas {
  static updateUserRequestSchema = {
    type: UpdateUserRequestDto,
    description: 'User update request data',
    examples: {
      'update-username': {
        summary: 'Update username',
        description: 'Update user username',
        value: {
          username: 'newusername',
        },
      },
    },
  };

  /**
   * Combined Swagger decorator for the update user endpoint
   * Includes operation, path parameter, request body, and all response schemas
   */
  static updateUserDecorators = () => {
    return (
      target: object,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) => {
      ApiOperation({
        summary: 'Update user username',
        description: `Update a user's username.

**Request Format:**
\`\`\`http
PUT /api/users/01HZ123456789ABCDEFGHIJKLMN
Content-Type: application/json

{
  "username": "newusername"
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "data": {
    "id": "01HZ123456789ABCDEFGHIJKLMN",
    "email": "john.doe@example.com",
    "username": "newusername",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:35:00.000Z",
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

      ApiParam({
        name: 'id',
        description: 'User ID (ULID)',
        example: '01HZ123456789ABCDEFGHIJKLMN',
      })(target, propertyKey, descriptor);

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

      ApiInternalServerErrorResponse({
        description: 'Internal server error',
        schema: ErrorResponseSchemas.internalServerErrorSchema,
      })(target, propertyKey, descriptor);
    };
  };
}
