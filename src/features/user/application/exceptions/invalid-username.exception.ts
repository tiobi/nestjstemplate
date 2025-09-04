import { HttpStatus } from '@nestjs/common';
import { BaseException } from 'src/features/common/domain/exceptions/base.exception';

export class InvalidUsernameException extends BaseException {
  static readonly CODE = 'INVALID_USERNAME';

  constructor(message: string, username?: string) {
    super(
      message,
      InvalidUsernameException.CODE,
      HttpStatus.BAD_REQUEST,
      username ? { username } : undefined,
    );
  }
}
