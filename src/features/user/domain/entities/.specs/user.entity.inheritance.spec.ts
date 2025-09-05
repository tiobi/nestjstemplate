import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRole } from '../../enums/user-role.enum';
import { EmailVO } from '../../value_objects/email.vo';
import { UsernameVO } from '../../value_objects/username.vo';
import { UserEntity } from '../user.entity';

describe('UserEntity - BaseEntity Inheritance', () => {
  let user: UserEntity;

  beforeEach(() => {
    user = UserEntity.createUser(
      EmailVO.fromString('test@example.com'),
      UsernameVO.fromString('testuser'),
    );
  });

  describe('BaseEntity getters', () => {
    it('should have id getter', () => {
      // Act
      const id = user.id();

      // Assert
      expect(id).toBeInstanceOf(UlidVO);
      expect(id.value).toBeDefined();
      expect(typeof id.value).toBe('string');
    });

    it('should have createdAt getter', () => {
      // Act
      const createdAt = user.createdAt();

      // Assert
      expect(createdAt).toBeInstanceOf(TimestampVO);
      expect(createdAt.value).toBeInstanceOf(Date);
    });

    it('should have updatedAt getter', () => {
      // Act
      const updatedAt = user.updatedAt();

      // Assert
      expect(updatedAt).toBeInstanceOf(TimestampVO);
      expect(updatedAt.value).toBeInstanceOf(Date);
    });

    it('should have deletedAt getter', () => {
      // Act
      const deletedAt = user.deletedAt();

      // Assert
      expect(deletedAt).toBeNull();
    });

    it('should return consistent values across multiple calls', () => {
      // Act
      const id1 = user.id();
      const id2 = user.id();
      const createdAt1 = user.createdAt();
      const createdAt2 = user.createdAt();
      const updatedAt1 = user.updatedAt();
      const updatedAt2 = user.updatedAt();
      const deletedAt1 = user.deletedAt();
      const deletedAt2 = user.deletedAt();

      // Assert
      expect(id1).toBe(id2);
      expect(createdAt1).toBe(createdAt2);
      expect(updatedAt1).toBe(updatedAt2);
      expect(deletedAt1).toBe(deletedAt2);
    });
  });

  describe('BaseEntity methods', () => {
    it('should have delete method', () => {
      // Act
      const deletedUser = user.delete();

      // Assert
      expect(deletedUser).toBeInstanceOf(UserEntity);
      expect(deletedUser.deletedAt()).not.toBeNull();
    });

    it('should create new instance when deleting', () => {
      // Act
      const deletedUser = user.delete();

      // Assert
      expect(deletedUser).not.toBe(user);
    });

    it('should preserve id when deleting', () => {
      // Act
      const deletedUser = user.delete();

      // Assert
      expect(deletedUser.id().value).toBe(user.id().value);
    });

    it('should preserve createdAt when deleting', () => {
      // Act
      const deletedUser = user.delete();

      // Assert
      expect(deletedUser.createdAt().value).toBe(user.createdAt().value);
    });

    it('should update updatedAt when deleting', async () => {
      // Arrange
      const originalUpdatedAt = user.updatedAt().value.getTime();
      await new Promise((resolve) => setTimeout(resolve, 1));

      // Act
      const deletedUser = user.delete();

      // Assert
      expect(deletedUser.updatedAt().value.getTime()).toBeGreaterThan(
        originalUpdatedAt,
      );
    });

    it('should set deletedAt timestamp when deleting', async () => {
      // Arrange
      await new Promise((resolve) => setTimeout(resolve, 1));

      // Act
      const deletedUser = user.delete();

      // Assert
      expect(deletedUser.deletedAt()).not.toBeNull();
      expect(deletedUser.deletedAt()?.value.getTime()).toBeGreaterThan(
        user.createdAt().value.getTime(),
      );
    });

    it('should not modify original user when deleting', () => {
      // Act
      const deletedUser = user.delete();

      // Assert
      expect(user.deletedAt()).toBeNull();
      expect(deletedUser.deletedAt()).not.toBeNull();
    });
  });

  describe('inheritance behavior', () => {
    it('should be instance of UserEntity', () => {
      // Assert
      expect(user).toBeInstanceOf(UserEntity);
    });

    it('should have all BaseEntity methods available', () => {
      // Assert
      expect(typeof user.id).toBe('function');
      expect(typeof user.createdAt).toBe('function');
      expect(typeof user.updatedAt).toBe('function');
      expect(typeof user.deletedAt).toBe('function');
      expect(typeof user.delete).toBe('function');
    });

    it('should have UserEntity specific methods', () => {
      // Assert
      expect(typeof user.getEmail).toBe('function');
      expect(typeof user.getRole).toBe('function');
      expect(typeof user.getUsername).toBe('function');
      expect(typeof user.updateUser).toBe('function');
      expect(typeof user.softDelete).toBe('function');
    });

    it('should maintain UserEntity properties after BaseEntity operations', () => {
      // Act
      const deletedUser = user.delete() as UserEntity;

      // Assert
      expect(deletedUser.getEmail().value).toBe('test@example.com');
      expect(deletedUser.getRole()).toBe(UserRole.USER);
      expect(deletedUser.getUsername().value).toBe('testuser');
    });
  });

  describe('timestamp consistency', () => {
    it('should have createdAt before or equal to updatedAt for new user', () => {
      // Assert
      expect(user.createdAt().value.getTime()).toBeLessThanOrEqual(
        user.updatedAt().value.getTime(),
      );
    });

    it('should have updatedAt after createdAt for new user', () => {
      // Assert
      expect(user.updatedAt().value.getTime()).toBeGreaterThanOrEqual(
        user.createdAt().value.getTime(),
      );
    });

    it('should maintain timestamp relationships after operations', async () => {
      // Arrange
      await new Promise((resolve) => setTimeout(resolve, 1));

      // Act
      const updatedUser = user.updateUser();
      const deletedUser = user.delete();

      // Assert
      expect(updatedUser.createdAt().value.getTime()).toBeLessThanOrEqual(
        updatedUser.updatedAt().value.getTime(),
      );
      expect(deletedUser.createdAt().value.getTime()).toBeLessThanOrEqual(
        deletedUser.updatedAt().value.getTime(),
      );
      expect(deletedUser.updatedAt().value.getTime()).toBeLessThanOrEqual(
        deletedUser.deletedAt()?.value.getTime() || 0,
      );
    });
  });

  describe('immutability', () => {
    it('should not allow direct modification of timestamps', () => {
      // Arrange
      const originalCreatedAt = user.createdAt().value;
      const originalUpdatedAt = user.updatedAt().value;

      // Act
      user.updateUser();

      // Assert
      expect(user.createdAt().value).toBe(originalCreatedAt);
      expect(user.updatedAt().value).toBe(originalUpdatedAt);
    });

    it('should return new instances for all operations', () => {
      // Act
      const updatedUser = user.updateUser();
      const deletedUser = user.delete();

      // Assert
      expect(updatedUser).not.toBe(user);
      expect(deletedUser).not.toBe(user);
      expect(updatedUser).not.toBe(deletedUser);
    });
  });
});
