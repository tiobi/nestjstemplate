# Project Structure & Organization

## Root Level Structure

```
├── src/                    # Source code
├── test/                   # E2E tests
├── dist/                   # Compiled output
├── logs/                   # Application logs
├── scripts/                # Build and utility scripts
└── node_modules/           # Dependencies
```

## Source Code Organization (`src/`)

### Feature-Based Architecture

Each feature follows Clean Architecture with these layers:

```
src/features/{feature-name}/
├── core/                   # Module definition and DI setup
├── domain/                 # Business logic layer
│   ├── entities/          # Domain entities with business rules
│   ├── value_objects/     # Immutable value objects
│   ├── enums/             # Domain enums
│   ├── repositories/      # Repository interfaces
│   └── services/          # Domain services
├── application/           # Use cases layer
│   ├── usecases/         # Application use cases
│   ├── services/         # Application services
│   └── exceptions/       # Application-specific exceptions
├── infrastructure/        # External concerns layer
│   ├── firestore/        # Database implementations
│   ├── config/           # Infrastructure configuration
│   └── mappers/          # Data mapping utilities
└── interfaces/           # API layer
    ├── controllers/      # HTTP controllers
    ├── dto/              # Data Transfer Objects
    ├── schemas/          # API documentation schemas
    ├── pipes/            # Custom validation pipes
    └── validators/       # Custom validators
```

### Common Shared Code (`src/common/`)

```
src/common/
├── entities/             # Base entity classes
├── value_objects/        # Shared value objects (ULID, Timestamp)
├── exceptions/           # Base exception classes
├── filters/              # Global exception filters
├── guards/               # Authentication/authorization guards
├── interceptors/         # Request/response interceptors
├── pipes/                # Global validation pipes
├── services/             # Shared services (logging, etc.)
└── types/                # TypeScript type definitions
```

### Configuration (`src/config/`)

- Application configuration files
- Environment-specific settings
- Swagger documentation setup

## Naming Conventions

### Files & Directories

- **kebab-case** for file and directory names
- **Descriptive suffixes**: `.entity.ts`, `.dto.ts`, `.controller.ts`, `.service.ts`, `.module.ts`
- **Feature directories**: Use singular nouns (e.g., `user/`, not `users/`)

### Classes & Interfaces

- **PascalCase** for class names with descriptive suffixes
- **Entities**: `UserEntity`, `OrderEntity`
- **Value Objects**: `EmailVO`, `TimestampVO`
- **DTOs**: `CreateUserRequestDto`, `UserResponseDto`
- **Controllers**: `UserController`
- **Services/Use Cases**: `CreateNewUserUsecase`
- **Repositories**: `UserRepository` (interface), `UserRepositoryImpl` (implementation)

### Methods & Variables

- **camelCase** for methods and variables
- **Private fields**: Prefix with underscore `_email`, `_createdAt`
- **Factory methods**: Use static methods like `createUser()`, `fromData()`

## Architectural Rules

### Domain Layer

- No dependencies on external frameworks
- Entities are immutable with factory methods
- Value objects validate their own invariants
- Repository interfaces define contracts

### Application Layer

- Contains use cases that orchestrate domain objects
- Handles application-specific exceptions
- No direct database or HTTP concerns

### Infrastructure Layer

- Implements repository interfaces
- Handles external service integrations
- Contains framework-specific code

### Interface Layer

- Controllers handle HTTP concerns only
- DTOs for request/response validation
- Mappers convert between DTOs and domain objects
- Swagger schemas for API documentation

## Module Organization

- Each feature has a core module that wires dependencies
- Use dependency injection with interface-based contracts
- Export repository interfaces, not implementations
- Import feature modules in `AppModule`
