# Design Document

## Overview

This design enhances the existing user controller with comprehensive CRUD operations while maintaining the current Clean Architecture pattern. The solution extends the existing user feature by adding new use cases, repository methods, DTOs, and controller endpoints. All new components will follow the established patterns and integrate seamlessly with the existing codebase.

## Architecture

The design follows the existing Clean Architecture layers:

- **Interface Layer**: Enhanced UserController with new endpoints, additional DTOs for requests/responses
- **Application Layer**: New use cases for get, update, delete, and list operations
- **Domain Layer**: Extended UserRepository interface with additional methods
- **Infrastructure Layer**: Enhanced repository implementation with new database operations

## Components and Interfaces

### Enhanced Controller Endpoints

```typescript
@Controller('users')
export class UserController {
  // Existing
  POST /users - Create user

  // New endpoints
  GET /users/:id - Get user by ID
  GET /users - List users with pagination
  PUT /users/:id - Update user
  DELETE /users/:id - Delete user
}
```

### New Use Cases

1. **GetUserByIdUsecase**
   - Input: User ID (string)
   - Output: UserEntity or throws UserNotFoundException
   - Validates ID format and retrieves user from repository

2. **GetUsersUsecase**
   - Input: Pagination parameters (page, limit)
   - Output: Paginated list of UserEntity with metadata
   - Handles pagination logic and default values

3. **UpdateUserUsecase**
   - Input: User ID, email, username
   - Output: Updated UserEntity
   - Validates uniqueness constraints and updates user

4. **DeleteUserUsecase**
   - Input: User ID
   - Output: void
   - Performs soft delete by setting deletedAt timestamp

### Extended Repository Interface

```typescript
export abstract class UserRepository {
  // Existing methods
  abstract create(user: UserEntity): Promise<void>;
  abstract findByEmail(email: EmailVO): Promise<UserEntity | null>;

  // New methods
  abstract findById(id: UlidVO): Promise<UserEntity | null>;
  abstract findAll(
    page: number,
    limit: number,
  ): Promise<{
    users: UserEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  abstract update(user: UserEntity): Promise<void>;
  abstract delete(id: UlidVO): Promise<void>;
}
```

### New DTOs

1. **UpdateUserRequestDto**
   - email?: string (optional)
   - username?: string (optional)
   - Validation: email format, username constraints

2. **GetUsersQueryDto**
   - page?: number (default: 1, min: 1)
   - limit?: number (default: 10, min: 1, max: 100)

3. **PaginatedUsersResponseDto**
   - users: UserResponseDto[]
   - pagination: PaginationMetadataDto

4. **PaginationMetadataDto**
   - total: number
   - page: number
   - limit: number
   - totalPages: number

### Enhanced Swagger Schemas

New schema classes for each endpoint:

- UserControllerGetUserSchemas
- UserControllerGetUsersSchemas
- UserControllerUpdateUserSchemas
- UserControllerDeleteUserSchemas

## Data Models

### User Entity Updates

The existing UserEntity supports the required operations through:

- Immutable design with factory methods
- Built-in soft delete capability via BaseEntity
- Update method through createCopyWithTimestamp

### Value Objects

Leverage existing value objects:

- UlidVO for ID validation
- EmailVO for email validation
- UsernameVO for username validation
- TimestampVO for temporal data

## Error Handling

### Exception Types

1. **UserNotFoundException** (existing)
   - HTTP 404 - User not found by ID

2. **EmailAlreadyExistsException** (existing)
   - HTTP 409 - Email conflict during update

3. **InvalidEmailException** (existing)
   - HTTP 400 - Invalid email format

4. **InvalidUsernameException** (existing)
   - HTTP 400 - Invalid username format

### Validation Strategy

- Use class-validator decorators in DTOs
- Leverage existing pipes (ReservedUsernamePipe)
- ID format validation through UlidVO
- Pagination parameter validation

### Global Error Handling

Utilize existing GlobalExceptionFilter for:

- Consistent error response format
- Proper HTTP status code mapping
- Error logging through AppLoggerService

## Testing Strategy

### Unit Tests

1. **Use Case Tests**
   - Test business logic in isolation
   - Mock repository dependencies
   - Verify error handling scenarios

2. **Controller Tests**
   - Test HTTP layer behavior
   - Mock use case dependencies
   - Verify request/response mapping

3. **Repository Tests**
   - Test data access logic
   - Mock Firestore dependencies
   - Verify query construction

### Integration Tests

1. **End-to-End Tests**
   - Test complete request/response cycle
   - Verify database interactions
   - Test error scenarios

2. **API Contract Tests**
   - Verify Swagger documentation accuracy
   - Test request/response schemas
   - Validate HTTP status codes

### Test Data Strategy

- Use factory methods for test entity creation
- Mock external dependencies (Firestore)
- Implement test data builders for complex scenarios
- Ensure test isolation and cleanup

## Implementation Considerations

### Pagination Implementation

- Default page size: 10 items
- Maximum page size: 100 items
- Offset-based pagination using Firestore queries
- Include total count for client-side pagination controls

### Soft Delete Behavior

- GET endpoints filter out soft-deleted users
- DELETE endpoint sets deletedAt timestamp
- Maintain referential integrity with related entities

### Performance Optimizations

- Index Firestore collections on frequently queried fields
- Implement query result caching where appropriate
- Use projection queries to minimize data transfer

### Security Considerations

- Validate all input parameters
- Sanitize user-provided data
- Implement rate limiting on list endpoints
- Consider implementing field-level permissions for updates
