import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRole } from '../../enums/user-role.enum';
import { EmailVO } from '../../value_objects/email.vo';
import { UsernameVO } from '../../value_objects/username.vo';
import { UserEntity } from '../user.entity';

describe('UserEntity - Getters', () => {
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

  describe('getEmail', () => {
    it('should return email value object', () => {
      // Act
      const email = user.getEmail();

      // Assert
      expect(email).toBeInstanceOf(EmailVO);
      expect(email.value).toBe('test@example.com');
    });

    it('should return same email instance on multiple calls', () => {
      // Act
      const email1 = user.getEmail();
      const email2 = user.getEmail();

      // Assert
      expect(email1).toBe(email2);
    });

    it('should return immutable email value', () => {
      // Act
      const email = user.getEmail();

      // Assert
      expect(email.value).toBe('test@example.com');
      // Verify immutability by checking the value doesn't change
      expect(email.value).toBe('test@example.com');
    });

    it('should return email with different formats', () => {
      // Arrange
      const complexEmail = EmailVO.fromString('user.name+tag@example.com');
      const userWithComplexEmail = UserEntity.fromData(
        UlidVO.create(),
        TimestampVO.create(),
        TimestampVO.create(),
        null,
        complexEmail,
        UserRole.USER,
        UsernameVO.fromString('omplexuser'),
      );

      // Act
      const email = userWithComplexEmail.getEmail();

      // Assert
      expect(email.value).toBe('user.name+tag@example.com');
    });
  });

  describe('getRole', () => {
    it('should return role enum value', () => {
      // Act
      const role = user.getRole();

      // Assert
      expect(role).toBe(UserRole.USER);
    });

    it('should return same role instance on multiple calls', () => {
      // Act
      const role1 = user.getRole();
      const role2 = user.getRole();

      // Assert
      expect(role1).toBe(role2);
    });

    it('should return different roles for different users', () => {
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

      const masterUser = UserEntity.fromData(
        UlidVO.create(),
        TimestampVO.create(),
        TimestampVO.create(),
        null,
        EmailVO.fromString('master@example.com'),
        UserRole.MASTER,
        UsernameVO.fromString('masteruser'),
      );

      // Act
      const userRole = user.getRole();
      const adminRole = adminUser.getRole();
      const masterRole = masterUser.getRole();

      // Assert
      expect(userRole).toBe(UserRole.USER);
      expect(adminRole).toBe(UserRole.ADMIN);
      expect(masterRole).toBe(UserRole.MASTER);
    });

    it('should return immutable role value', () => {
      // Act
      const role = user.getRole();

      // Assert
      expect(role).toBe(UserRole.USER);
      // Verify immutability
      expect(role).toBe(UserRole.USER);
    });
  });

  describe('getUsername', () => {
    it('should return username value object', () => {
      // Act
      const username = user.getUsername();

      // Assert
      expect(username).toBeInstanceOf(UsernameVO);
      expect(username.value).toBe('testuser');
    });

    it('should return same username instance on multiple calls', () => {
      // Act
      const username1 = user.getUsername();
      const username2 = user.getUsername();

      // Assert
      expect(username1).toBe(username2);
    });

    it('should return immutable username value', () => {
      // Act
      const username = user.getUsername();

      // Assert
      expect(username.value).toBe('testuser');
      // Verify immutability
      expect(username.value).toBe('testuser');
    });

    it('should return username with different lengths', () => {
      // Arrange
      const shortUsername = UsernameVO.fromString('abx');
      const longUsername = UsernameVO.fromString('verylongusername');
      const userWithShortUsername = UserEntity.fromData(
        UlidVO.create(),
        TimestampVO.create(),
        TimestampVO.create(),
        null,
        EmailVO.fromString('short@example.com'),
        UserRole.USER,
        shortUsername,
      );
      const userWithLongUsername = UserEntity.fromData(
        UlidVO.create(),
        TimestampVO.create(),
        TimestampVO.create(),
        null,
        EmailVO.fromString('long@example.com'),
        UserRole.USER,
        longUsername,
      );

      // Act
      const short = userWithShortUsername.getUsername();
      const long = userWithLongUsername.getUsername();

      // Assert
      expect(short.value).toBe('abx');
      expect(long.value).toBe('verylongusername');
    });
  });

  describe('getter consistency', () => {
    it('should return consistent values across multiple calls', () => {
      // Act
      const email1 = user.getEmail();
      const email2 = user.getEmail();
      const role1 = user.getRole();
      const role2 = user.getRole();
      const username1 = user.getUsername();
      const username2 = user.getUsername();

      // Assert
      expect(email1.value).toBe(email2.value);
      expect(role1).toBe(role2);
      expect(username1.value).toBe(username2.value);
    });

    it('should return different values for different users', () => {
      // Arrange
      const anotherUser = UserEntity.fromData(
        UlidVO.create(),
        TimestampVO.create(),
        TimestampVO.create(),
        null,
        EmailVO.fromString('another@example.com'),
        UserRole.ADMIN,
        UsernameVO.fromString('anotheruser'),
      );

      // Act
      const userEmail = user.getEmail();
      const anotherEmail = anotherUser.getEmail();
      const userRole = user.getRole();
      const anotherRole = anotherUser.getRole();
      const userUsername = user.getUsername();
      const anotherUsername = anotherUser.getUsername();

      // Assert
      expect(userEmail.value).not.toBe(anotherEmail.value);
      expect(userRole).not.toBe(anotherRole);
      expect(userUsername.value).not.toBe(anotherUsername.value);
    });
  });
});
