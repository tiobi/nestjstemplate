export class EmailVO {
  constructor(public readonly value: string) {
    const local = value.split('@')[0];
    const domain = value.split('@')[1];

    if (!this._isValidLocal(local)) {
      throw new Error('Invalid email');
    }

    if (!this._isValidDomain(domain)) {
      throw new Error('Invalid email');
    }
  }

  public static create(value: string): EmailVO {
    return new EmailVO(value);
  }

  private _isValidLocal(local: string): boolean {
    return /^[a-zA-Z0-9._%+-]+$/.test(local);
  }

  private _isValidDomain(domain: string): boolean {
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
  }
}
