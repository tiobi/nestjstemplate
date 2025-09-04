import { BaseEntity } from 'src/common/entities/base.entity';
import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRole } from '../enums/user-role.enum';
import { EmailVO } from '../value_objects/email.vo';
import { UsernameVO } from '../value_objects/username.vo';

export class UserEntity extends BaseEntity {
  private readonly _email: EmailVO;
  private readonly _role: UserRole;
  private readonly _username: UsernameVO;

  private constructor(
    id: UlidVO,
    createdAt: TimestampVO,
    updatedAt: TimestampVO,
    deletedAt: TimestampVO | null = null,
    email: EmailVO,
    role: UserRole,
    username: UsernameVO,
  ) {
    super(id, createdAt, updatedAt, deletedAt);
    this._email = email;
    this._role = role;
    this._username = username;
  }

  /**
   * Factory method to create a new user
   */
  public static createUser(email: EmailVO, username: UsernameVO): UserEntity {
    const now = new TimestampVO();
    return new UserEntity(
      new UlidVO(),
      now,
      now,
      null,
      email,
      UserRole.USER,
      username,
    );
  }

  /**
   * Factory method to create a user from existing data (e.g., from database)
   */
  public static fromData(
    id: UlidVO,
    createdAt: TimestampVO,
    updatedAt: TimestampVO,
    deletedAt: TimestampVO | null = null,
    email: EmailVO,
    role: UserRole,
    username: UsernameVO,
  ): UserEntity {
    return new UserEntity(
      id,
      createdAt,
      updatedAt,
      deletedAt,
      email,
      role,
      username,
    );
  }

  public getEmail(): EmailVO {
    return this._email;
  }

  public getRole(): UserRole {
    return this._role;
  }

  public getUsername(): UsernameVO {
    return this._username;
  }

  protected override createCopyWithTimestamp(
    updatedAt: TimestampVO,
    deletedAt: TimestampVO | null,
  ): UserEntity {
    return UserEntity.fromData(
      this.id(), // Preserve the same ID
      this.createdAt(), // Preserve the same creation time
      updatedAt, // Use the new updated time
      deletedAt, // Use the new deleted time
      this._email,
      this._role,
      this._username,
    );
  }
}
