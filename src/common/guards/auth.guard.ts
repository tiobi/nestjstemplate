import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private readonly BEARER_TOKEN_PREFIX = 'Bearer';
  private readonly TOKEN_NULL_ERROR_MESSAGE = 'Token is null';
  private readonly TOKEN_INVALID_ERROR_MESSAGE = 'Token is invalid';
  private readonly AUTH_ERROR_MESSAGE = 'Authentication failed';

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const token = this._extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException(this.TOKEN_NULL_ERROR_MESSAGE);
      }

      const isValid = this._validateToken(token);

      if (!isValid) {
        throw new UnauthorizedException(this.TOKEN_INVALID_ERROR_MESSAGE);
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(this.AUTH_ERROR_MESSAGE, error as Error);
    }
  }

  private _extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === this.BEARER_TOKEN_PREFIX ? token : undefined;
  }

  private _validateToken(token: string): boolean {
    return token.length > 0;
  }
}
