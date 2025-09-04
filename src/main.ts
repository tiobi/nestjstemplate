import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CustomLoggerInterceptor } from './common/interceptors/custom-logger.interceptor';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Set up global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set up global interceptors
  app.useGlobalInterceptors(
    new ResponseTransformInterceptor(),
    new CustomLoggerInterceptor(),
  );

  // Set up global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Set up Swagger documentation (only in development and staging)
  const nodeEnv = process.env.NODE_ENV || 'development';
  if (nodeEnv !== 'production') {
    setupSwagger(app);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  if (nodeEnv !== 'production') {
    console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  }
}
bootstrap().catch(console.error);
