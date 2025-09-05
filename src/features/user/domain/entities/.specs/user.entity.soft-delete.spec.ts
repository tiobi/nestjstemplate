import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRole } from '../../enums/user-role.enum';
import { EmailVO } from '../../value_objects/email.vo';
import { UsernameVO } from '../../value_objects/username.vo';
import { UserEntity } from '../user.entity';

describe('UserEntity - softDelete', () => {
  let user: UserEntity;
  const now = TimestampVO.create();

  beforeEach(() => {
    user = UserEntity.fromData(
      UlidVO.create(),
      now,
      now,
      null, // not deleted
      EmailVO.fromString('user@example.com'),
      UserRole.USER,
      UsernameVO.fromString('johndoe'),
    );
  });

  it('should soft delete user and set deletedAt timestamp', async () => {
    // Add small delay to ensure timestamps are different
    await new Promise((resolve) => setTimeout(resolve, 1));

    // Act
    const softDeletedUser = user.softDelete();

    // Assert
    expect(softDeletedUser.id().value).toBe(user.id().value);
    expect(softDeletedUser.createdAt().value).toBe(user.createdAt().value);
    expect(softDeletedUser.deletedAt()).not.toBeNull();
    expect(softDeletedUser.deletedAt()?.value.getTime()).toBeGreaterThan(
      now.value.getTime(),
    );
    expect(softDeletedUser.updatedAt().value.getTime()).toBeGreaterThan(
      now.value.getTime(),
    );
    expect(softDeletedUser.getEmail().value).toBe(user.getEmail().value);
    expect(softDeletedUser.getRole()).toBe(user.getRole());
    expect(softDeletedUser.getUsername().value).toBe(user.getUsername().value);
  });

  it('should not modify original user entity', () => {
    // Act
    const softDeletedUser = user.softDelete();

    // Assert
    expect(user.deletedAt()).toBeNull();
    expect(softDeletedUser.deletedAt()).not.toBeNull();
    expect(softDeletedUser.id().value).toBe(user.id().value);
  });

  it('should create new instance with different timestamps', async () => {
    // Add small delay to ensure timestamps are different
    await new Promise((resolve) => setTimeout(resolve, 1));

    // Act
    const softDeletedUser = user.softDelete();

    // Assert
    expect(softDeletedUser).not.toBe(user);
    expect(softDeletedUser.updatedAt().value.getTime()).toBeGreaterThan(
      user.updatedAt().value.getTime(),
    );
    expect(softDeletedUser.deletedAt()).not.toBeNull();
  });
});
