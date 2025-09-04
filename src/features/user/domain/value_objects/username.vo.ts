export class UsernameVO {
  private readonly _value: string;

  private constructor(public readonly value: string) {
    if (value.length < 3 || value.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    if (!this._isValid(value)) {
      throw new Error('Username cannot contain the letter "c"');
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
