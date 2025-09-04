import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerStandardConfig = {
  title: 'NestJS Template API',
  description:
    'A comprehensive NestJS template with Clean Architecture, DDD patterns, and enterprise-ready features',
  version: '1.0.0',
  path: 'api/docs',
};

export function setupSwaggerStandard(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(swaggerStandardConfig.title)
    .setDescription(swaggerStandardConfig.description)
    .setVersion(swaggerStandardConfig.version)
    .setContact('API Support', 'support@example.com', 'https://example.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000/api', 'Development server')
    .addServer('https://api.example.com', 'Production server')
    .addTag('Health', 'Health check endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Key for external services',
      },
      'api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Standard Swagger UI with minimal customization
  SwaggerModule.setup(swaggerStandardConfig.path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      tryItOutEnabled: true,
      requestSnippetsEnabled: true,
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
      layout: 'StandaloneLayout',
      deepLinking: true,
      showMutatedRequest: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      validatorUrl: null,
    },
    customSiteTitle: `${swaggerStandardConfig.title} Documentation`,
  });
}
