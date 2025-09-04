export class TimestampVO {
  private _value: Date;

  constructor() {
    this._value = this._generate();
  }

  get value(): Date {
    return this._value;
  }

  public toJsonFormat(): string {
    return this._value.toISOString();
  }

  /**
   * Update the timestamp value to the current date if no date is provided.
   * @param {Date} [date] - The date to update the timestamp value to.
   * @returns {Date} The updated timestamp value.
   */
  update(date?: Date): Date {
    if (date) {
      this._value = date;
    } else {
      this._value = this._updateToNow();
    }

    return this._value;
  }

  private _generate(): Date {
    return new Date();
  }

  private _updateToNow(): Date {
    return this._generate();
  }
}
