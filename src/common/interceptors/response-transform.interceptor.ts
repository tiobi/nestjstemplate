import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data: data as Record<string, any>,
          meta: {
            timestamp: new Date().toISOString(),
            path: context.switchToHttp().getRequest<Request>().url,
            version: process.env.VERSION || '1.0.0',
          },
        };
      }),
    );
  }
}
