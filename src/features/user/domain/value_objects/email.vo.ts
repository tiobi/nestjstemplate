/**
 * Represents an email address value object with validation.
 * Ensures email format compliance and provides immutable email handling.
 */
export class EmailVO {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    this._validate(value);
  }

  /**
   * Creates a new email from a string with validation.
   * @param value - The email string to create from.
   * @returns A new EmailVO instance.
   * @throws Error if the email format is invalid.
   */
  public static create(value: string): EmailVO {
    return new EmailVO(value);
  }

  /**
   * Creates a new email from a string with validation.
   * @param value - The email string to create from.
   * @returns A new EmailVO instance.
   * @throws Error if the email format is invalid.
   */
  public static fromString(value: string): EmailVO {
    return new EmailVO(value);
  }

  /**
   * Gets the email value as a string.
   * @returns The email value.
   */
  get value(): string {
    return this._value;
  }

  private _validate(value: string): void {
    const local = value.split('@')[0];
    const domain = value.split('@')[1];

    if (!this._isValidLocal(local)) {
      throw new Error(`Invalid email local part: ${value}`);
    }

    if (!this._isValidDomain(domain)) {
      throw new Error(`Invalid email domain part: ${value}`);
    }
  }

  private _isValidLocal(local: string): boolean {
    return /^[a-zA-Z0-9._%+-]+$/.test(local);
  }

  private _isValidDomain(domain: string): boolean {
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
  }
}
