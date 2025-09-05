import { monotonicFactory } from 'ulid';

export class UlidVO {
  private readonly _value: string;
  private static readonly _monotonicFactory = monotonicFactory();

  constructor() {
    this._value = this._generate();
  }

  static fromString(value: string): UlidVO {
    // Basic ULID format validation (26 characters, Crockford's Base32)
    if (
      !value ||
      value.length !== 26 ||
      !/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i.test(value)
    ) {
      throw new Error('Invalid ULID format');
    }
    const instance = Object.create(UlidVO.prototype) as UlidVO & {
      _value: string;
    };

    return instance;
  }

  get value(): string {
    return this._value;
  }

  private _generate(): string {
    return UlidVO._monotonicFactory();
  }
}
