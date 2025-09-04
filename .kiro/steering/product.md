# Product Overview

This is a NestJS template project that serves as a foundation for building scalable server-side applications. The project implements a clean architecture pattern with domain-driven design principles.

## Key Features

- User management system with role-based access
- RESTful API with comprehensive Swagger documentation
- Health check endpoints for monitoring
- JWT-based authentication system
- Global exception handling and request/response transformation
- Comprehensive logging and validation

## Architecture Philosophy

The project follows Domain-Driven Design (DDD) and Clean Architecture principles, organizing code into distinct layers:

- **Domain Layer**: Core business logic, entities, and value objects
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External concerns like databases and third-party services
- **Interface Layer**: Controllers, DTOs, and API schemas

This separation ensures maintainability, testability, and independence from external frameworks.
