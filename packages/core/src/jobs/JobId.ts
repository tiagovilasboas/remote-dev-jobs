export class JobId {
  private constructor(private readonly _value: string) {}

  public static create(value: string): JobId {
    if (!value || value.trim() === '') {
      throw new Error('JobId cannot be empty');
    }
    return new JobId(value);
  }

  public toString(): string {
    return this._value;
  }

  get value(): string {
    return this._value;
  }
} 