import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

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
            version: '1.0',
          },
        };
      }),
    );
  }
}
