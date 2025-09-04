# Technology Stack

## Core Framework & Runtime

- **NestJS 11.x** - Progressive Node.js framework with TypeScript
- **Node.js** - JavaScript runtime
- **TypeScript 5.7.x** - Strongly typed JavaScript with ES2023 target

## Key Dependencies

- **class-validator & class-transformer** - DTO validation and transformation
- **@nestjs/swagger** - API documentation generation
- **@nestjs/jwt & passport** - Authentication and authorization
- **@nestjs/terminus** - Health checks
- **ulid** - Unique identifier generation

## Development Tools

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting (single quotes, trailing commas, 80 char width)
- **Jest** - Testing framework
- **Nodemon** - Development file watching
- **PM2** - Production process management

## Build System

- **TypeScript Compiler** - Native tsc with nodenext module resolution
- **Nest CLI** - Project scaffolding and build tools

## Common Commands

### Development

```bash
npm run dev                    # Start with nodemon (recommended)
npm run start:dev             # Start with nest --watch
npm run start:debug           # Debug mode with inspect
```

### Building & Production

```bash
npm run build                 # Clean and compile TypeScript
npm run start:prod            # Run compiled JavaScript
npm run start:prod:pm2        # Production with PM2
```

### Code Quality

```bash
npm run lint                  # Fix linting issues
npm run lint:check           # Check without fixing
npm run format               # Format code with Prettier
npm run type-check           # TypeScript type checking
```

### Testing

```bash
npm run test                 # Unit tests
npm run test:watch          # Watch mode
npm run test:cov            # With coverage
npm run test:e2e            # End-to-end tests
```

### Documentation

```bash
npm run swagger:generate     # Generate Swagger documentation
```

## Configuration Notes

- Global API prefix: `/api`
- Swagger docs available at `/api/docs` (non-production only)
- Default port: 3000
- Validation: whitelist enabled, transform enabled, forbid non-whitelisted properties
