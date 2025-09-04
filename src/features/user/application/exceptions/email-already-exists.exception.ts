import { HttpStatus } from '@nestjs/common';
import { BaseException } from 'src/common/exceptions/base.exception';

export class EmailAlreadyExistsException extends BaseException {
  static readonly CODE = 'EMAIL_ALREADY_EXISTS';

  constructor(email: string) {
    super(
      `Email ${email} already exists`,
      EmailAlreadyExistsException.CODE,
      HttpStatus.CONFLICT,
      { email },
    );
  }
}
