import { monotonicFactory } from 'ulid';

/**
 * Represents a ULID (Universally Unique Lexicographically Sortable Identifier) value object.
 * Provides immutable ULID handling with validation and monotonic generation.
 */
export class UlidVO {
  private readonly _value: string;
  private static readonly _monotonicFactory = monotonicFactory();

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a new ULID with a generated monotonic identifier.
   * @returns A new UlidVO instance with a unique ULID.
   */
  public static create(): UlidVO {
    return new UlidVO(UlidVO._monotonicFactory());
  }

  /**
   * Creates a new ULID from an existing ULID string.
   * @param value - The ULID string to create from (26 characters, Crockford's Base32).
   * @returns A new UlidVO instance.
   * @throws Error if the ULID format is invalid.
   */
  public static fromString(value: string): UlidVO {
    // Basic ULID format validation (26 characters, Crockford's Base32)
    if (
      !value ||
      value.length !== 26 ||
      !/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i.test(value)
    ) {
      throw new Error(`Invalid ULID format: ${value}`);
    }
    return new UlidVO(value);
  }

  /**
   * Gets the ULID value as a string.
   * @returns The ULID value.
   */
  get value(): string {
    return this._value;
  }
}
