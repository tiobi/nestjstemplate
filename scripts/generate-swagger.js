#!/usr/bin/env node

const { NestFactory } = require('@nestjs/core');
const { SwaggerModule } = require('@nestjs/swagger');
const { DocumentBuilder } = require('@nestjs/swagger');
const { AppModule } = require('../dist/app.module');

async function generateSwagger() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS Template API')
    .setDescription(
      'A comprehensive NestJS template with Clean Architecture, DDD patterns, and enterprise-ready features',
    )
    .setVersion('1.0.0')
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
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Write to file
  const fs = require('fs');
  const path = require('path');

  const outputPath = path.join(__dirname, '..', 'swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log(`✅ Swagger JSON generated at: ${outputPath}`);

  await app.close();
}

generateSwagger().catch(console.error);
