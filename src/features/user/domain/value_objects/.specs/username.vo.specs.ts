import { InvalidUsernameException } from '../../../application/exceptions/invalid-username.exception';
import { UsernameVO } from '../username.vo';

describe('UsernameVO', () => {
  describe('create', () => {
    it('should create a valid username', () => {
      // Arrange
      const validUsername = 'testuser';

      // Act
      const username = UsernameVO.create(validUsername);

      // Assert
      expect(username.value).toBe(validUsername);
    });

    it('should throw error for username too short', () => {
      // Arrange
      const shortUsername = 'ab';

      // Act & Assert
      expect(() => UsernameVO.create(shortUsername)).toThrow(
        InvalidUsernameException,
      );
    });

    it('should throw error for username too long', () => {
      // Arrange
      const longUsername = 'a'.repeat(21);

      // Act & Assert
      expect(() => UsernameVO.create(longUsername)).toThrow(
        InvalidUsernameException,
      );
    });

    it('should throw error for username containing letter c', () => {
      // Arrange
      const usernameWithC = 'testcuser';

      // Act & Assert
      expect(() => UsernameVO.create(usernameWithC)).toThrow(
        InvalidUsernameException,
      );
    });

    it('should throw error for username containing uppercase C', () => {
      // Arrange
      const usernameWithC = 'testCuser';

      // Act & Assert
      expect(() => UsernameVO.create(usernameWithC)).toThrow(
        InvalidUsernameException,
      );
    });
  });

  describe('fromString', () => {
    it('should create a valid username from string', () => {
      // Arrange
      const validUsername = 'testuser';

      // Act
      const username = UsernameVO.fromString(validUsername);

      // Assert
      expect(username.value).toBe(validUsername);
    });

    it('should throw error for invalid username from string', () => {
      // Arrange
      const invalidUsername = 'testcuser';

      // Act & Assert
      expect(() => UsernameVO.fromString(invalidUsername)).toThrow(
        InvalidUsernameException,
      );
    });
  });
});
