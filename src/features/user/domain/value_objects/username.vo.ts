import { InvalidUsernameException } from '../../application/exceptions/invalid-username.exception';

/**
 * Represents a username value object with business rule validation.
 * Enforces username constraints: 3-20 characters, no 'c' letter allowed.
 */
export class UsernameVO {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    this._validate(value);
  }

  /**
   * Creates a new username from a string with validation.
   * @param value - The username string to create from.
   * @returns A new UsernameVO instance.
   * @throws InvalidUsernameException if the username format is invalid.
   */
  public static create(value: string): UsernameVO {
    return new UsernameVO(value);
  }

  /**
   * Creates a new username from a string with validation.
   * @param value - The username string to create from.
   * @returns A new UsernameVO instance.
   * @throws InvalidUsernameException if the username format is invalid.
   */
  public static fromString(value: string): UsernameVO {
    return new UsernameVO(value);
  }

  /**
   * Gets the username value as a string.
   * @returns The username value.
   */
  get value(): string {
    return this._value;
  }

  private _validate(value: string): void {
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
  }

  private _isValid(value: string): boolean {
    const invalidChar = 'c';
    return !value.toLowerCase().includes(invalidChar);
  }
}
