// import {
//   CallHandler,
//   ExecutionContext,
//   NestInterceptor,
//   HttpException,
// } from '@nestjs/common';
// import { Observable, tap } from 'rxjs';
// import { Request, Response } from 'express';
// import { AppLoggerService } from '../services/app-logger.service';

// export class CustomLoggerInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const response = context.switchToHttp().getResponse<Response>();

//     const startTime = Date.now();
//     const method = request.method;
//     const url = request.url;
//     const headers = request.headers;
//     const body = request.body as Record<string, any>;
//     const query = request.query;
//     const params = request.params;
//     const userAgent = (headers['user-agent'] as string) || 'unknown';
//     const ip =
//       request.ip ||
//       (request.connection as { remoteAddress?: string })?.remoteAddress ||
//       'unknown';

//     // Log incoming request
//     AppLoggerService.i('Incoming Request', {
//       method,
//       url,
//       ip,
//       userAgent,
//       query: Object.keys(query).length > 0 ? query : undefined,
//       params: Object.keys(params).length > 0 ? params : undefined,
//       body: this.sanitizeBody(body as Record<string, any> | undefined),
//       timestamp: new Date().toISOString(),
//     });

//     return next.handle().pipe(
//       tap({
//         next: (responseData) => {
//           const duration = Date.now() - startTime;
//           const statusCode = response.statusCode;

//           // Log successful response
//           AppLoggerService.i('Outgoing Response', {
//             method,
//             url,
//             statusCode,
//             duration: `${duration}ms`,
//             responseSize: this.getResponseSize(responseData),
//             timestamp: new Date().toISOString(),
//           });
//         },
//         error: (error: HttpException | Error) => {
//           const duration = Date.now() - startTime;
//           const statusCode =
//             error instanceof HttpException ? error.getStatus() : 500;

//           // Log error response
//           AppLoggerService.e(
//             'Request Error',
//             {
//               method,
//               url,
//               statusCode,
//               duration: `${duration}ms`,
//               error: error.message,
//               stack: error.stack,
//               timestamp: new Date().toISOString(),
//             },
//             error,
//           );
//         },
//       }),
//     );
//   }

//   private sanitizeBody(
//     body: Record<string, any> | undefined,
//   ): Record<string, any> | undefined {
//     if (!body) return undefined;

//     // Remove sensitive fields
//     const sensitiveFields = [
//       'password',
//       'token',
//       'secret',
//       'key',
//       'authorization',
//     ];
//     const sanitized = { ...body };

//     for (const field of sensitiveFields) {
//       if (sanitized[field]) {
//         sanitized[field] = '[REDACTED]';
//       }
//     }

//     return sanitized;
//   }

//   private getResponseSize(data: any): string {
//     if (!data) return '0 bytes';

//     try {
//       const jsonString = JSON.stringify(data);
//       const bytes = Buffer.byteLength(jsonString, 'utf8');

//       if (bytes < 1024) return `${bytes} bytes`;
//       if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
//       return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
//     } catch {
//       return 'unknown';
//     }
//   }
// }
