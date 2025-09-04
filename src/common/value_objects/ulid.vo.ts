import { monotonicFactory } from 'ulid';

export class UlidVO {
  private readonly _value: string;
  private static readonly _monotonicFactory = monotonicFactory();

  constructor() {
    this._value = this._generate();
  }

  get value(): string {
    return this._value;
  }

  private _generate(): string {
    return UlidVO._monotonicFactory();
  }
}
