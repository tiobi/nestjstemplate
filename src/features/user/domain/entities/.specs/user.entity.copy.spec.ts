import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRole } from '../../enums/user-role.enum';
import { EmailVO } from '../../value_objects/email.vo';
import { UsernameVO } from '../../value_objects/username.vo';
import { UserEntity } from '../user.entity';

describe('UserEntity - Copy Methods', () => {
  let user: UserEntity;

  beforeEach(() => {
    user = UserEntity.fromData(
      UlidVO.create(),
      TimestampVO.create(),
      TimestampVO.create(),
      null,
      EmailVO.fromString('test@example.com'),
      UserRole.USER,
      UsernameVO.fromString('testuser'),
    );
  });

  describe('createCopyWithTimestamp', () => {
    it('should create copy with new updatedAt timestamp', () => {
      // Arrange
      const newUpdatedAt = TimestampVO.create();

      // Act
      const copy = (user as any).createCopyWithTimestamp(newUpdatedAt, null);

      // Assert
      expect(copy.id().value).toBe(user.id().value);
      expect(copy.createdAt().value).toBe(user.createdAt().value);
      expect(copy.updatedAt().value).toBe(newUpdatedAt.value);
      expect(copy.deletedAt()).toBeNull();
      expect(copy.getEmail().value).toBe(user.getEmail().value);
      expect(copy.getRole()).toBe(user.getRole());
      expect(copy.getUsername().value).toBe(user.getUsername().value);
    });

    it('should create copy with new deletedAt timestamp', () => {
      // Arrange
      const newUpdatedAt = TimestampVO.create();
      const newDeletedAt = TimestampVO.create();

      // Act
      const copy = (user as any).createCopyWithTimestamp(
        newUpdatedAt,
        newDeletedAt,
      );

      // Assert
      expect(copy.id().value).toBe(user.id().value);
      expect(copy.createdAt().value).toBe(user.createdAt().value);
      expect(copy.updatedAt().value).toBe(newUpdatedAt.value);
      expect(copy.deletedAt()?.value).toBe(newDeletedAt.value);
      expect(copy.getEmail().value).toBe(user.getEmail().value);
      expect(copy.getRole()).toBe(user.getRole());
      expect(copy.getUsername().value).toBe(user.getUsername().value);
    });

    it('should create new instance', () => {
      // Arrange
      const newUpdatedAt = TimestampVO.create();

      // Act
      const copy = (user as any).createCopyWithTimestamp(newUpdatedAt, null);

      // Assert
      expect(copy).not.toBe(user);
    });

    it('should preserve all user properties', () => {
      // Arrange
      const newUpdatedAt = TimestampVO.create();
      const newDeletedAt = TimestampVO.create();

      // Act
      const copy = (user as any).createCopyWithTimestamp(
        newUpdatedAt,
        newDeletedAt,
      );

      // Assert
      expect(copy.getEmail().value).toBe('test@example.com');
      expect(copy.getRole()).toBe(UserRole.USER);
      expect(copy.getUsername().value).toBe('testuser');
    });

    it('should handle different timestamp values', () => {
      // Arrange
      const futureUpdatedAt = TimestampVO.create();
      futureUpdatedAt.value.setTime(Date.now() + 86400000); // 1 day in future
      const pastDeletedAt = TimestampVO.create();
      pastDeletedAt.value.setTime(Date.now() - 86400000); // 1 day in past

      // Act
      const copy = (user as any).createCopyWithTimestamp(
        futureUpdatedAt,
        pastDeletedAt,
      );

      // Assert
      expect(copy.updatedAt().value.getTime()).toBe(
        futureUpdatedAt.value.getTime(),
      );
      expect(copy.deletedAt()?.value.getTime()).toBe(
        pastDeletedAt.value.getTime(),
      );
    });

    it('should handle null deletedAt parameter', () => {
      // Arrange
      const newUpdatedAt = TimestampVO.create();

      // Act
      const copy = (user as any).createCopyWithTimestamp(newUpdatedAt, null);

      // Assert
      expect(copy.deletedAt()).toBeNull();
    });

    it('should work with different user roles', () => {
      // Arrange
      const adminUser = UserEntity.fromData(
        UlidVO.create(),
        TimestampVO.create(),
        TimestampVO.create(),
        null,
        EmailVO.fromString('admin@example.com'),
        UserRole.ADMIN,
        UsernameVO.fromString('adminuser'),
      );
      const newUpdatedAt = TimestampVO.create();

      // Act
      const copy = (adminUser as any).createCopyWithTimestamp(
        newUpdatedAt,
        null,
      );

      // Assert
      expect(copy.getRole()).toBe(UserRole.ADMIN);
      expect(copy.getEmail().value).toBe('admin@example.com');
      expect(copy.getUsername().value).toBe('adminuser');
    });

    it('should work with already deleted users', () => {
      // Arrange
      const deletedAt = TimestampVO.create();
      const deletedUser = UserEntity.fromData(
        user.id(),
        user.createdAt(),
        user.updatedAt(),
        deletedAt,
        user.getEmail(),
        user.getRole(),
        user.getUsername(),
      );
      const newUpdatedAt = TimestampVO.create();
      const newDeletedAt = TimestampVO.create();

      // Act
      const copy = (deletedUser as any).createCopyWithTimestamp(
        newUpdatedAt,
        newDeletedAt,
      );

      // Assert
      expect(copy.deletedAt()?.value).toBe(newDeletedAt.value);
      expect(copy.updatedAt().value).toBe(newUpdatedAt.value);
    });

    it('should maintain immutability of original user', () => {
      // Arrange
      const originalUpdatedAt = user.updatedAt().value;
      const originalDeletedAt = user.deletedAt();
      const newUpdatedAt = TimestampVO.create();
      const newDeletedAt = TimestampVO.create();

      // Act
      const copy = (user as any).createCopyWithTimestamp(
        newUpdatedAt,
        newDeletedAt,
      );

      // Assert
      expect(user.updatedAt().value).toBe(originalUpdatedAt);
      expect(user.deletedAt()).toBe(originalDeletedAt);
      expect(copy.updatedAt().value).toBe(newUpdatedAt.value);
      expect(copy.deletedAt()?.value).toBe(newDeletedAt.value);
    });

    it('should create independent instances', () => {
      // Arrange
      const newUpdatedAt = TimestampVO.create();
      const newDeletedAt = TimestampVO.create();

      // Act
      const copy1 = (user as any).createCopyWithTimestamp(
        newUpdatedAt,
        newDeletedAt,
      );
      const copy2 = (user as any).createCopyWithTimestamp(
        newUpdatedAt,
        newDeletedAt,
      );

      // Assert
      expect(copy1).not.toBe(copy2);
      expect(copy1).not.toBe(user);
      expect(copy2).not.toBe(user);
    });
  });

  describe('createCopyWithTimestamp edge cases', () => {
    it('should handle same timestamp values', () => {
      // Arrange
      const sameTimestamp = user.updatedAt();

      // Act
      const copy = (user as any).createCopyWithTimestamp(sameTimestamp, null);

      // Assert
      expect(copy.updatedAt().value).toBe(sameTimestamp.value);
      expect(copy.id().value).toBe(user.id().value);
    });

    it('should handle very old timestamps', () => {
      // Arrange
      const oldTimestamp = TimestampVO.create();
      oldTimestamp.value.setTime(0); // Unix epoch

      // Act
      const copy = (user as any).createCopyWithTimestamp(oldTimestamp, null);

      // Assert
      expect(copy.updatedAt().value.getTime()).toBe(0);
    });

    it('should handle very future timestamps', () => {
      // Arrange
      const futureTimestamp = TimestampVO.create();
      futureTimestamp.value.setTime(4102444800000); // Year 2100

      // Act
      const copy = (user as any).createCopyWithTimestamp(futureTimestamp, null);

      // Assert
      expect(copy.updatedAt().value.getTime()).toBe(4102444800000);
    });
  });
});
