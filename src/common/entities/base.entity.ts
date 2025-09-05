import { TimestampVO } from '../value_objects/timestamp.vo';
import { UlidVO } from '../value_objects/ulid.vo';

/**
 * Abstract base class for all domain entities.
 * Provides common functionality for entity lifecycle management.
 */
export abstract class BaseEntity {
  protected readonly _id: UlidVO;
  protected readonly _createdAt: TimestampVO;
  protected readonly _updatedAt: TimestampVO;
  protected readonly _deletedAt: TimestampVO | null;

  /**
   * Protected constructor - use factory methods instead
   * @param id - Unique identifier for the entity
   * @param createdAt - Timestamp when the entity was created
   * @param updatedAt - Timestamp when the entity was last updated
   * @param deletedAt - Timestamp when the entity was deleted (optional)
   */
  protected constructor(
    id: UlidVO,
    createdAt: TimestampVO,
    updatedAt: TimestampVO,
    deletedAt: TimestampVO | null = null,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;
  }

  public id(): UlidVO {
    return this._id;
  }

  public hashCode(): string {
    return this._id.value;
  }

  public createdAt(): TimestampVO {
    return this._createdAt;
  }

  public updatedAt(): TimestampVO {
    return this._updatedAt;
  }

  public deletedAt(): TimestampVO | null {
    return this._deletedAt;
  }

  public isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  /**
   * Updates the entity's timestamp to the current time.
   */
  protected updateTimestamp(): BaseEntity {
    return this.createCopyWithTimestamp(TimestampVO.create(), this._deletedAt);
  }

  /**
   * Soft deletes the entity by setting the deletedAt timestamp.
   * Updates the updatedAt and deletedAt timestamps to the current time.
   */
  public delete(): BaseEntity {
    return this.createCopyWithTimestamp(
      TimestampVO.create(),
      TimestampVO.create(),
    );
  }

  /**
   * Restores a soft-deleted entity by clearing the deletedAt timestamp.
   */
  public restore(): BaseEntity {
    return this.createCopyWithTimestamp(this._updatedAt, null);
  }

  /**
   * Converts the entity to a JSON-serializable object.
   */
  public toJson(): Record<string, any> {
    return {
      id: this._id.value,
      createdAt: this._createdAt.toJsonFormat(),
      updatedAt: this._updatedAt.toJsonFormat(),
      deletedAt: this._deletedAt?.toJsonFormat(),
    };
  }

  /**
   * Creates a copy of the entity with updated timestamps.
   * Must be implemented by concrete entity classes.
   */
  protected abstract createCopyWithTimestamp(
    updatedAt: TimestampVO,
    deletedAt: TimestampVO | null,
  ): BaseEntity;
}
