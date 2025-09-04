import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/features/user/domain/entities/user.entity';
import { Request } from 'express';
import { UserRole } from 'src/features/user/domain/enums/user-role.enum';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private readonly USER_NOT_FOUND_ERROR_MESSAGE = 'User not found';
  private readonly USER_NOT_AUTHORIZED_ERROR_MESSAGE = 'User not authorized';

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user as UserEntity;

    if (!user) {
      throw new ForbiddenException(this.USER_NOT_FOUND_ERROR_MESSAGE);
    }

    if (user.getRole() !== UserRole.ADMIN) {
      throw new ForbiddenException(this.USER_NOT_AUTHORIZED_ERROR_MESSAGE);
    }

    return true;
  }
}
