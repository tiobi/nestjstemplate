/**
 * Represents a timestamp value object that encapsulates date and time operations.
 * Provides immutable timestamp handling with validation and utility methods.
 */
export class TimestampVO {
  private _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  /**
   * Creates a new timestamp with the current date and time.
   * @returns A new TimestampVO instance with current time.
   */
  public static create(): TimestampVO {
    return new TimestampVO(new Date());
  }

  /**
   * Creates a new timestamp from a specific date.
   * @param date - The date to create the timestamp from.
   * @returns A new TimestampVO instance.
   */
  public static fromDate(date: Date): TimestampVO {
    return new TimestampVO(new Date(date));
  }

  /**
   * Creates a new timestamp from a date string.
   * @param dateString - The date string to parse (ISO format recommended).
   * @returns A new TimestampVO instance.
   * @throws Error if the date string is invalid.
   */
  public static fromString(dateString: string): TimestampVO {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dateString}`);
    }
    return new TimestampVO(date);
  }

  /**
   * Gets the timestamp value as a Date object.
   * @returns The timestamp value.
   */
  get value(): Date {
    return this._value;
  }

  /**
   * Converts the timestamp to ISO string format.
   * @returns The timestamp in ISO string format (e.g., "2024-01-01T12:00:00.000Z").
   */
  public toJsonFormat(): string {
    return this._value.toISOString();
  }

  /**
   * Updates the timestamp to a new date or current time.
   * @param date - Optional date to update to. If not provided, updates to current time.
   * @returns The updated timestamp value.
   */
  update(date?: Date): Date {
    if (date) {
      this._value = date;
    } else {
      this._value = this._updateToNow();
    }

    return this._value;
  }

  private _updateToNow(): Date {
    return new Date();
  }
}
