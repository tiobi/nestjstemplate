import { HttpStatus } from '@nestjs/common';
import { BaseException } from 'src/common/exceptions/base.exception';

export class InvalidEmailException extends BaseException {
  static readonly CODE = 'INVALID_EMAIL';

  constructor(email: string) {
    super(
      `Invalid email: ${email}`,
      InvalidEmailException.CODE,
      HttpStatus.BAD_REQUEST,
      { email },
    );
  }
}
