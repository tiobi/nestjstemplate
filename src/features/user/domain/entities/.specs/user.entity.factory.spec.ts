import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRole } from '../../enums/user-role.enum';
import { EmailVO } from '../../value_objects/email.vo';
import { UsernameVO } from '../../value_objects/username.vo';
import { UserEntity } from '../user.entity';

describe('UserEntity - Factory Methods', () => {
  describe('createUser', () => {
    it('should create a new user with USER role', () => {
      // Arrange
      const email = EmailVO.fromString('user@example.com');
      const username = UsernameVO.fromString('johndoe');

      // Act
      const user = UserEntity.createUser(email, username);

      // Assert
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.getEmail().value).toBe('user@example.com');
      expect(user.getUsername().value).toBe('johndoe');
      expect(user.getRole()).toBe(UserRole.USER);
      expect(user.id()).toBeInstanceOf(UlidVO);
      expect(user.createdAt()).toBeInstanceOf(TimestampVO);
      expect(user.updatedAt()).toBeInstanceOf(TimestampVO);
      expect(user.deletedAt()).toBeNull();
    });

    it('should create user with different email and username', () => {
      // Arrange
      const email = EmailVO.fromString('admin@company.com');
      const username = UsernameVO.fromString('adminuser');

      // Act
      const user = UserEntity.createUser(email, username);

      // Assert
      expect(user.getEmail().value).toBe('admin@company.com');
      expect(user.getUsername().value).toBe('adminuser');
      expect(user.getRole()).toBe(UserRole.USER);
    });

    it('should generate unique IDs for different users', () => {
      // Arrange
      const email1 = EmailVO.fromString('user1@example.com');
      const username1 = UsernameVO.fromString('user1');
      const email2 = EmailVO.fromString('user2@example.com');
      const username2 = UsernameVO.fromString('user2');

      // Act
      const user1 = UserEntity.createUser(email1, username1);
      const user2 = UserEntity.createUser(email2, username2);

      // Assert
      expect(user1.id().value).not.toBe(user2.id().value);
    });

    it('should set same timestamps for createdAt and updatedAt', () => {
      // Arrange
      const email = EmailVO.fromString('user@example.com');
      const username = UsernameVO.fromString('johndoe');

      // Act
      const user = UserEntity.createUser(email, username);

      // Assert
      expect(user.createdAt().value.getTime()).toBe(
        user.updatedAt().value.getTime(),
      );
    });

    it('should always create with USER role regardless of input', () => {
      // Arrange
      const email = EmailVO.fromString('admin@example.com');
      const username = UsernameVO.fromString('adminuser');

      // Act
      const user = UserEntity.createUser(email, username);

      // Assert
      expect(user.getRole()).toBe(UserRole.USER);
    });
  });

  describe('fromData', () => {
    it('should create user from existing data', () => {
      // Arrange
      const id = UlidVO.create();
      const createdAt = TimestampVO.create();
      const updatedAt = TimestampVO.create();
      const email = EmailVO.fromString('existing@example.com');
      const username = UsernameVO.fromString('existinguser');
      const role = UserRole.ADMIN;

      // Act
      const user = UserEntity.fromData(
        id,
        createdAt,
        updatedAt,
        null,
        email,
        role,
        username,
      );

      // Assert
      expect(user.id().value).toBe(id.value);
      expect(user.createdAt().value).toBe(createdAt.value);
      expect(user.updatedAt().value).toBe(updatedAt.value);
      expect(user.deletedAt()).toBeNull();
      expect(user.getEmail().value).toBe('existing@example.com');
      expect(user.getUsername().value).toBe('existinguser');
      expect(user.getRole()).toBe(UserRole.ADMIN);
    });

    it('should create user with deletedAt timestamp', () => {
      // Arrange
      const id = UlidVO.create();
      const createdAt = TimestampVO.create();
      const updatedAt = TimestampVO.create();
      const deletedAt = TimestampVO.create();
      const email = EmailVO.fromString('deleted@example.com');
      const username = UsernameVO.fromString('deleteduser');
      const role = UserRole.USER;

      // Act
      const user = UserEntity.fromData(
        id,
        createdAt,
        updatedAt,
        deletedAt,
        email,
        role,
        username,
      );

      // Assert
      expect(user.deletedAt()?.value).toBe(deletedAt.value);
    });

    it('should create user with MASTER role', () => {
      // Arrange
      const id = UlidVO.create();
      const createdAt = TimestampVO.create();
      const updatedAt = TimestampVO.create();
      const email = EmailVO.fromString('master@example.com');
      const username = UsernameVO.fromString('masteruser');
      const role = UserRole.MASTER;

      // Act
      const user = UserEntity.fromData(
        id,
        createdAt,
        updatedAt,
        null,
        email,
        role,
        username,
      );

      // Assert
      expect(user.getRole()).toBe(UserRole.MASTER);
    });

    it('should preserve all provided data exactly', () => {
      // Arrange
      const id = UlidVO.create();
      const createdAt = TimestampVO.create();
      const updatedAt = TimestampVO.create();
      const email = EmailVO.fromString('preserve@example.com');
      const username = UsernameVO.fromString('preserveuser');
      const role = UserRole.ADMIN;

      // Act
      const user = UserEntity.fromData(
        id,
        createdAt,
        updatedAt,
        null,
        email,
        role,
        username,
      );

      // Assert
      expect(user.id().value).toBe(id.value);
      expect(user.createdAt().value).toBe(createdAt.value);
      expect(user.updatedAt().value).toBe(updatedAt.value);
      expect(user.getEmail().value).toBe('preserve@example.com');
      expect(user.getUsername().value).toBe('preserveuser');
      expect(user.getRole()).toBe(UserRole.ADMIN);
    });

    it('should handle different timestamp values', () => {
      // Arrange
      const id = UlidVO.create();
      const createdAt = TimestampVO.create();
      const updatedAt = TimestampVO.create();
      updatedAt.value.setTime(createdAt.value.getTime() + 1000);
      const email = EmailVO.fromString('timestamps@example.com');
      const username = UsernameVO.fromString('timestampsuser');
      const role = UserRole.USER;

      // Act
      const user = UserEntity.fromData(
        id,
        createdAt,
        updatedAt,
        null,
        email,
        role,
        username,
      );

      // Assert
      expect(user.createdAt().value.getTime()).toBe(createdAt.value.getTime());
      expect(user.updatedAt().value.getTime()).toBe(updatedAt.value.getTime());
      expect(user.updatedAt().value.getTime()).toBeGreaterThan(
        user.createdAt().value.getTime(),
      );
    });
  });

  describe('factory method comparison', () => {
    it('should create different instances with createUser vs fromData', () => {
      // Arrange
      const email = EmailVO.fromString('compare@example.com');
      const username = UsernameVO.fromString('ompareuser');
      const id = UlidVO.create();
      const now = TimestampVO.create();

      // Act
      const createdUser = UserEntity.createUser(email, username);
      const fromDataUser = UserEntity.fromData(
        id,
        now,
        now,
        null,
        email,
        UserRole.USER,
        username,
      );

      // Assert
      expect(createdUser).not.toBe(fromDataUser);
      expect(createdUser.id().value).not.toBe(fromDataUser.id().value);
      expect(createdUser.getEmail().value).toBe(fromDataUser.getEmail().value);
      expect(createdUser.getUsername().value).toBe(
        fromDataUser.getUsername().value,
      );
      expect(createdUser.getRole()).toBe(fromDataUser.getRole());
    });
  });
});
