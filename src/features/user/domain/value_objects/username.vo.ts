import { InvalidUsernameException } from '../../application/exceptions/invalid-username.exception';

export class UsernameVO {
  private readonly _value: string;

  private constructor(public readonly value: string) {
    if (value.length < 3 || value.length > 20) {
      throw new InvalidUsernameException(
        'Username must be between 3 and 20 characters',
        value,
      );
    }

    if (!this._isValid(value)) {
      throw new InvalidUsernameException(
        'Username cannot contain the letter "c"',
        value,
      );
    }

    this._value = value;
  }

  public static create(value: string): UsernameVO {
    return new UsernameVO(value);
  }

  private _isValid(value: string): boolean {
    const invalidChar = 'c';
    return !value.toLowerCase().includes(invalidChar);
  }
}
