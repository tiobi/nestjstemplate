import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PaginatedUsersResponseDto } from '../dto/paginated-users.response.dto';

export class UserControllerGetUsersByDateRangeSchemas {
  static getUsersByDateRangeDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get users by date range',
        description: `Retrieve paginated list of users that joined within a specific date range.

**Request Format:**
\`\`\`http
GET /api/users/by-date-range?startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T23:59:59.999Z&page=1&limit=10
\`\`\`

**Query Parameters:**
- \`startDate\` - Start date (ISO 8601)
- \`endDate\` - End date (ISO 8601)  
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
    "path": "/api/users/by-date-range?startDate=2024-01-01T00%3A00%3A00.000Z&endDate=2024-12-31T23%3A59%3A59.999Z&page=1&limit=10",
    "version": "1.0"
  }
}
\`\`\``,

        tags: ['Users'],
      }),
      ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Start date (ISO 8601)',
        example: '2024-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
        examples: {
          'start-of-year': {
            summary: 'Start of year',
            description: 'Filter users from the beginning of 2024',
            value: '2024-01-01T00:00:00.000Z',
          },
        },
      }),
      ApiQuery({
        name: 'endDate',
        required: false,
        description: 'End date (ISO 8601)',
        example: '2024-12-31T23:59:59.999Z',
        type: 'string',
        format: 'date-time',
        examples: {
          'end-of-year': {
            summary: 'End of year',
            description: 'Filter users until the end of 2024',
            value: '2024-12-31T23:59:59.999Z',
          },
          'end-of-month': {
            summary: 'End of month',
            description: 'Filter users until the end of June 2024',
            value: '2024-06-30T23:59:59.999Z',
          },
        },
      }),
      ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number (default: 1)',
        example: 1,
        type: 'number',
        minimum: 1,
        default: 1,
        examples: {
          'first-page': {
            summary: 'First page',
            description: 'Get the first page of results',
            value: 1,
          },
          'second-page': {
            summary: 'Second page',
            description: 'Get the second page of results',
            value: 2,
          },
        },
      }),

      ApiResponse({
        status: 200,
        description: 'Successfully retrieved users by date range',
        type: PaginatedUsersResponseDto,
        examples: {
          'success-with-results': {
            summary: 'Success with results',
            value: {
              data: {
                users: [
                  {
                    id: '01HZ123456789ABCDEFGHIJKLMN',
                    email: 'john.doe@example.com',
                    username: 'johndoe',
                    createdAt: '2024-03-15T10:30:00.000Z',
                    updatedAt: '2024-03-15T10:30:00.000Z',
                    deletedAt: null,
                  },
                  {
                    id: '01HZ123456789ABCDEFGHIJKLMN',
                    email: 'jane.smith@example.com',
                    username: 'janesmith',
                    createdAt: '2024-03-20T14:45:00.000Z',
                    updatedAt: '2024-03-20T14:45:00.000Z',
                    deletedAt: null,
                  },
                ],
                pagination: {
                  total: 2,
                  page: 1,
                  limit: 10,
                  totalPages: 1,
                },
              },
              meta: {
                timestamp: '2025-01-05T01:48:10.478Z',
                path: '/api/users/by-date-range?startDate=2024-01-01T00%3A00%3A00.000Z&endDate=2024-12-31T23%3A59%3A59.999Z&page=1&limit=10',
              },
            },
          },
          'success-no-results': {
            summary: 'Success with no results',
            value: {
              data: {
                users: [],
                pagination: {
                  total: 0,
                  page: 1,
                  limit: 10,
                  totalPages: 0,
                },
              },
              meta: {
                timestamp: '2025-01-05T01:48:10.478Z',
                path: '/api/users/by-date-range?startDate=2024-01-01T00%3A00%3A00.000Z&endDate=2024-12-31T23%3A59%3A59.999Z&page=1&limit=10',
              },
            },
          },
        },
      }),
      ApiBadRequestResponse({
        description: 'Bad request - Invalid parameters provided',
        examples: {
          'invalid-date-format': {
            summary: 'Invalid date format',
            value: {
              statusCode: 400,
              message: 'startDate must be a valid ISO 8601 date string',
              error: 'Bad Request',
            },
          },
          'invalid-date-range': {
            summary: 'Invalid date range',
            value: {
              statusCode: 400,
              message: 'Start date must be before or equal to end date',
              error: 'Bad Request',
            },
          },
          'invalid-pagination': {
            summary: 'Invalid pagination parameters',
            value: {
              statusCode: 400,
              message: [
                'page must be a positive number',
                'limit must not be greater than 100',
              ],
              error: 'Bad Request',
            },
          },
        },
      }),
    );
  }
}
