import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from 'src/features/common/domain/exceptions/base.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Handle our custom BaseException instances
    if (exception instanceof BaseException) {
      const meta = {
        timestamp: new Date().toISOString(),
        path: request.url,
        version: '1.0',
      };

      return response
        .status(exception.statusCode)
        .json(exception.toApiResponse(meta));
    }

    // Handle other exceptions (NestJS built-in, validation errors, etc.)
    const status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const message: string = 'Internal server error';

    response.status(status).json({
      error: {
        code: 'INTERNAL_ERROR',
        message,
        timestamp: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        version: '1.0',
      },
    });
  }
}
