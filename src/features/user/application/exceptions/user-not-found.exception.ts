import { HttpStatus } from '@nestjs/common';
import { BaseException } from 'src/features/common/domain/exceptions/base.exception';

export class UserNotFoundException extends BaseException {
  static readonly CODE = 'USER_NOT_FOUND';

  constructor(userId: string) {
    super(
      `User with id ${userId} not found`,
      UserNotFoundException.CODE,
      HttpStatus.NOT_FOUND,
      { userId },
    );
  }
}
