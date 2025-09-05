import { EmailVO } from '../email.vo';

describe('EmailVO', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      // Arrange
      const validEmail = 'test@example.com';

      // Act
      const email = EmailVO.create(validEmail);

      // Assert
      expect(email.value).toBe(validEmail);
    });

    it('should create email with complex local part', () => {
      // Arrange
      const complexEmail = 'user.name+tag@example.com';

      // Act
      const email = EmailVO.create(complexEmail);

      // Assert
      expect(email.value).toBe(complexEmail);
    });

    it('should create email with subdomain', () => {
      // Arrange
      const subdomainEmail = 'test@mail.example.com';

      // Act
      const email = EmailVO.create(subdomainEmail);

      // Assert
      expect(email.value).toBe(subdomainEmail);
    });

    it('should throw error for email without @ symbol', () => {
      // Arrange
      const invalidEmail = 'testexample.com';

      // Act & Assert
      expect(() => EmailVO.create(invalidEmail)).toThrow(
        'Invalid email domain part: testexample.com',
      );
    });

    it('should throw error for email with multiple @ symbols', () => {
      // Arrange
      const invalidEmail = 'test@example@com';

      // Act & Assert
      expect(() => EmailVO.create(invalidEmail)).toThrow(
        'Invalid email domain part: test@example@com',
      );
    });

    it('should throw error for empty local part', () => {
      // Arrange
      const invalidEmail = '@example.com';

      // Act & Assert
      expect(() => EmailVO.create(invalidEmail)).toThrow(
        'Invalid email local part: @example.com',
      );
    });

    it('should throw error for local part with invalid characters', () => {
      // Arrange
      const invalidEmail = 'test#user@example.com';

      // Act & Assert
      expect(() => EmailVO.create(invalidEmail)).toThrow(
        'Invalid email local part: test#user@example.com',
      );
    });

    it('should throw error for empty domain', () => {
      // Arrange
      const invalidEmail = 'test@';

      // Act & Assert
      expect(() => EmailVO.create(invalidEmail)).toThrow(
        'Invalid email domain part: test@',
      );
    });

    it('should throw error for domain without TLD', () => {
      // Arrange
      const invalidEmail = 'test@example';

      // Act & Assert
      expect(() => EmailVO.create(invalidEmail)).toThrow(
        'Invalid email domain part: test@example',
      );
    });

    it('should throw error for domain with invalid characters', () => {
      // Arrange
      const invalidEmail = 'test@exam#ple.com';

      // Act & Assert
      expect(() => EmailVO.create(invalidEmail)).toThrow(
        'Invalid email domain part: test@exam#ple.com',
      );
    });

    it('should throw error for TLD too short', () => {
      // Arrange
      const invalidEmail = 'test@example.c';

      // Act & Assert
      expect(() => EmailVO.create(invalidEmail)).toThrow(
        'Invalid email domain part: test@example.c',
      );
    });
  });

  describe('fromString', () => {
    it('should create a valid email from string', () => {
      // Arrange
      const validEmail = 'user@domain.com';

      // Act
      const email = EmailVO.fromString(validEmail);

      // Assert
      expect(email.value).toBe(validEmail);
    });

    it('should throw error for invalid email from string', () => {
      // Arrange
      const invalidEmail = 'invalid-email';

      // Act & Assert
      expect(() => EmailVO.fromString(invalidEmail)).toThrow(
        'Invalid email domain part: invalid-email',
      );
    });
  });

  describe('value getter', () => {
    it('should return the email value', () => {
      // Arrange
      const emailValue = 'test@example.com';
      const email = EmailVO.create(emailValue);

      // Act
      const result = email.value;

      // Assert
      expect(result).toBe(emailValue);
    });

    it('should return immutable value', () => {
      // Arrange
      const emailValue = 'test@example.com';
      const email = EmailVO.create(emailValue);

      // Act
      const result = email.value;

      // Assert
      expect(result).toBe(emailValue);
      expect(result).toBe(email.value); // Should return the same value consistently
    });
  });

  describe('edge cases', () => {
    it('should handle email with numbers in local part', () => {
      // Arrange
      const emailWithNumbers = 'user123@example.com';

      // Act
      const email = EmailVO.create(emailWithNumbers);

      // Assert
      expect(email.value).toBe(emailWithNumbers);
    });

    it('should handle email with hyphens in domain', () => {
      // Arrange
      const emailWithHyphens = 'test@my-domain.com';

      // Act
      const email = EmailVO.create(emailWithHyphens);

      // Assert
      expect(email.value).toBe(emailWithHyphens);
    });

    it('should handle email with underscores in local part', () => {
      // Arrange
      const emailWithUnderscores = 'user_name@example.com';

      // Act
      const email = EmailVO.create(emailWithUnderscores);

      // Assert
      expect(email.value).toBe(emailWithUnderscores);
    });

    it('should handle email with plus sign in local part', () => {
      // Arrange
      const emailWithPlus = 'user+tag@example.com';

      // Act
      const email = EmailVO.create(emailWithPlus);

      // Assert
      expect(email.value).toBe(emailWithPlus);
    });

    it('should handle email with dots in local part', () => {
      // Arrange
      const emailWithDots = 'first.last@example.com';

      // Act
      const email = EmailVO.create(emailWithDots);

      // Assert
      expect(email.value).toBe(emailWithDots);
    });

    it('should handle email with percent encoding in local part', () => {
      // Arrange
      const emailWithPercent = 'user%20name@example.com';

      // Act
      const email = EmailVO.create(emailWithPercent);

      // Assert
      expect(email.value).toBe(emailWithPercent);
    });
  });
});
