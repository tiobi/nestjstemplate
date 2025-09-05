import { HttpStatus } from '@nestjs/common';
import { TimestampVO } from '../value_objects/timestamp.vo';

/**
 * Abstract base class for all domain exceptions.
 * Provides common functionality for exception handling and error reporting.
 */
export abstract class BaseException extends Error {
  protected readonly _code: string;
  protected readonly _statusCode: HttpStatus;
  protected readonly _details?: Record<string, any>;
  protected readonly _timestamp: TimestampVO;

  /**
   * Protected constructor - use concrete exception classes instead
   * @param message - Human-readable error message
   * @param code - Unique error code for this exception type
   * @param statusCode - HTTP status code (for API responses)
   * @param details - Additional error details (optional)
   */
  protected constructor(
    message: string,
    code: string,
    statusCode: HttpStatus,
    details?: Record<string, any>,
  ) {
    super(message);

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this._code = code;
    this._statusCode = statusCode;
    this._details = details;
    this._timestamp = TimestampVO.create();
  }

  /**
   * Gets the error code for this exception
   */
  public get code(): string {
    return this._code;
  }

  /**
   * Gets the HTTP status code for this exception
   */
  public get statusCode(): HttpStatus {
    return this._statusCode;
  }

  /**
   * Gets additional error details
   */
  public get details(): Record<string, any> | undefined {
    return this._details;
  }

  /**
   * Gets the timestamp when the exception was created
   */
  public get timestamp(): TimestampVO {
    return this._timestamp;
  }

  /**
   * Converts the exception to a JSON-serializable object
   */
  public toJson(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this._code,
      statusCode: this._statusCode,
      details: this._details,
      timestamp: this._timestamp.toJsonFormat(),
      stack: this.stack,
    };
  }

  /**
   * Creates a user-friendly error message for API responses
   */
  public toApiResponse(meta?: Record<string, any>): Record<string, any> {
    return {
      error: {
        code: this._code,
        statusCode: this._statusCode,
        message: this.message,
        details: this._details,
        timestamp: this._timestamp.toJsonFormat(),
      },
      meta: meta || {
        timestamp: this._timestamp.toJsonFormat(),
        version: '1.0',
      },
    };
  }

  /**
   * Checks if this exception is of a specific type
   */
  public isOfType<T extends BaseException>(
    exceptionType: new (...args: any[]) => T,
  ): boolean {
    return this instanceof exceptionType;
  }
}
