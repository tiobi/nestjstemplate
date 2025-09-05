import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRole } from '../../enums/user-role.enum';
import { EmailVO } from '../../value_objects/email.vo';
import { UsernameVO } from '../../value_objects/username.vo';
import { UserEntity } from '../user.entity';

describe('UserEntity - Update Methods', () => {
  let user: UserEntity;

  beforeEach(() => {
    user = UserEntity.fromData(
      UlidVO.create(),
      TimestampVO.create(),
      TimestampVO.create(),
      null,
      EmailVO.fromString('original@example.com'),
      UserRole.USER,
      UsernameVO.fromString('originaluser'),
    );
  });

  describe('updateUser', () => {
    it('should update email only', async () => {
      // Arrange
      const newEmail = EmailVO.fromString('newemail@example.com');
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const updatedUser = user.updateUser(newEmail);

      // Assert
      expect(updatedUser.getEmail().value).toBe('newemail@example.com');
      expect(updatedUser.getUsername().value).toBe('originaluser');
      expect(updatedUser.getRole()).toBe(UserRole.USER);
      expect(updatedUser.id().value).toBe(user.id().value);
      expect(updatedUser.createdAt().value).toBe(user.createdAt().value);
      expect(updatedUser.updatedAt().value.getTime()).toBeGreaterThan(
        user.updatedAt().value.getTime(),
      );
    });

    it('should update username only', async () => {
      // Arrange
      const newUsername = UsernameVO.fromString('newusername');
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const updatedUser = user.updateUser(undefined, newUsername);

      // Assert
      expect(updatedUser.getEmail().value).toBe('original@example.com');
      expect(updatedUser.getUsername().value).toBe('newusername');
      expect(updatedUser.getRole()).toBe(UserRole.USER);
      expect(updatedUser.id().value).toBe(user.id().value);
      expect(updatedUser.createdAt().value).toBe(user.createdAt().value);
      expect(updatedUser.updatedAt().value.getTime()).toBeGreaterThan(
        user.updatedAt().value.getTime(),
      );
    });

    it('should update both email and username', async () => {
      // Arrange
      const newEmail = EmailVO.fromString('newemail@example.com');
      const newUsername = UsernameVO.fromString('newusername');
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const updatedUser = user.updateUser(newEmail, newUsername);

      // Assert
      expect(updatedUser.getEmail().value).toBe('newemail@example.com');
      expect(updatedUser.getUsername().value).toBe('newusername');
      expect(updatedUser.getRole()).toBe(UserRole.USER);
      expect(updatedUser.id().value).toBe(user.id().value);
      expect(updatedUser.createdAt().value).toBe(user.createdAt().value);
      expect(updatedUser.updatedAt().value.getTime()).toBeGreaterThan(
        user.updatedAt().value.getTime(),
      );
    });

    it('should not update anything when no parameters provided', async () => {
      // Arrange
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const updatedUser = user.updateUser();

      // Assert
      expect(updatedUser.getEmail().value).toBe('original@example.com');
      expect(updatedUser.getUsername().value).toBe('originaluser');
      expect(updatedUser.getRole()).toBe(UserRole.USER);
      expect(updatedUser.id().value).toBe(user.id().value);
      expect(updatedUser.createdAt().value).toBe(user.createdAt().value);
      expect(updatedUser.updatedAt().value.getTime()).toBeGreaterThan(
        user.updatedAt().value.getTime(),
      );
    });

    it('should preserve deletedAt when updating', () => {
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

      // Act
      const updatedUser = deletedUser.updateUser();

      // Assert
      expect(updatedUser.deletedAt()?.value).toBe(deletedAt.value);
    });

    it('should create new instance', () => {
      // Act
      const updatedUser = user.updateUser();

      // Assert
      expect(updatedUser).not.toBe(user);
    });

    it('should preserve role when updating', () => {
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

      // Act
      const updatedAdmin = adminUser.updateUser(
        EmailVO.fromString('newadmin@example.com'),
      );

      // Assert
      expect(updatedAdmin.getRole()).toBe(UserRole.ADMIN);
    });

    it('should handle complex email formats', async () => {
      // Arrange
      const complexEmail = EmailVO.fromString('user.name+tag@example.com');
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const updatedUser = user.updateUser(complexEmail);

      // Assert
      expect(updatedUser.getEmail().value).toBe('user.name+tag@example.com');
      expect(updatedUser.getUsername().value).toBe('originaluser');
    });

    it('should handle different username lengths', async () => {
      // Arrange
      const shortUsername = UsernameVO.fromString('abx');
      const longUsername = UsernameVO.fromString('verylongusername');
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const updatedWithShort = user.updateUser(undefined, shortUsername);
      const updatedWithLong = user.updateUser(undefined, longUsername);

      // Assert
      expect(updatedWithShort.getUsername().value).toBe('abx');
      expect(updatedWithLong.getUsername().value).toBe('verylongusername');
    });

    it('should maintain immutability of original user', () => {
      // Arrange
      const originalEmail = user.getEmail().value;
      const originalUsername = user.getUsername().value;

      // Act
      const updatedUser = user.updateUser(
        EmailVO.fromString('newemail@example.com'),
        UsernameVO.fromString('newusername'),
      );

      // Assert
      expect(user.getEmail().value).toBe(originalEmail);
      expect(user.getUsername().value).toBe(originalUsername);
      expect(updatedUser.getEmail().value).toBe('newemail@example.com');
      expect(updatedUser.getUsername().value).toBe('newusername');
    });

    it('should update timestamp even when no changes made', async () => {
      // Arrange
      const originalUpdatedAt = user.updatedAt().value.getTime();
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const updatedUser = user.updateUser();

      // Assert
      expect(updatedUser.updatedAt().value.getTime()).toBeGreaterThan(
        originalUpdatedAt,
      );
    });
  });

  describe('updateUser edge cases', () => {
    it('should handle null email parameter', () => {
      // Act
      const updatedUser = user.updateUser(null as any);

      // Assert
      expect(updatedUser.getEmail().value).toBe('original@example.com');
      expect(updatedUser.getUsername().value).toBe('originaluser');
    });

    it('should handle null username parameter', () => {
      // Act
      const updatedUser = user.updateUser(undefined, null as any);

      // Assert
      expect(updatedUser.getEmail().value).toBe('original@example.com');
      expect(updatedUser.getUsername().value).toBe('originaluser');
    });

    it('should handle both null parameters', () => {
      // Act
      const updatedUser = user.updateUser(null as any, null as any);

      // Assert
      expect(updatedUser.getEmail().value).toBe('original@example.com');
      expect(updatedUser.getUsername().value).toBe('originaluser');
    });
  });
});
