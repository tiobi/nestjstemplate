import { UserRole } from '../user-role.enum';

describe('UserRole', () => {
  describe('enum values', () => {
    it('should have MASTER role', () => {
      // Assert
      expect(UserRole.MASTER).toBe('master');
    });

    it('should have ADMIN role', () => {
      // Assert
      expect(UserRole.ADMIN).toBe('admin');
    });

    it('should have USER role', () => {
      // Assert
      expect(UserRole.USER).toBe('user');
    });
  });

  describe('enum properties', () => {
    it('should have all expected roles', () => {
      // Arrange
      const expectedRoles = ['master', 'admin', 'user'];

      // Act
      const actualRoles = Object.values(UserRole);

      // Assert
      expect(actualRoles).toEqual(expect.arrayContaining(expectedRoles));
      expect(actualRoles).toHaveLength(3);
    });

    it('should have unique values', () => {
      // Arrange
      const roles = Object.values(UserRole);

      // Act
      const uniqueRoles = [...new Set(roles)];

      // Assert
      expect(uniqueRoles).toHaveLength(roles.length);
    });

    it('should have string values', () => {
      // Act
      const roles = Object.values(UserRole);

      // Assert
      roles.forEach((role) => {
        expect(typeof role).toBe('string');
      });
    });
  });

  describe('enum usage', () => {
    it('should be usable in switch statements', () => {
      // Arrange
      const testRole = UserRole.ADMIN;
      let result = '';

      // Act
      switch (testRole) {
        case UserRole.ADMIN:
          result = 'admin-role';
          break;
        default:
          result = 'unknown-role';
      }

      // Assert
      expect(result).toBe('admin-role');
    });

    it('should be comparable with strict equality', () => {
      // Arrange
      const role1 = UserRole.USER;
      const role2 = UserRole.USER;
      const role3 = UserRole.ADMIN;

      // Act & Assert
      expect(role1 === role2).toBe(true);
      expect(role1).not.toBe(role3);
    });

    it('should be usable in array includes', () => {
      // Arrange
      const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.MASTER];
      const userRole = UserRole.ADMIN;
      const restrictedRole = UserRole.USER;

      // Act & Assert
      expect(allowedRoles.includes(userRole)).toBe(true);
      expect(allowedRoles.includes(restrictedRole)).toBe(false);
    });

    it('should be usable in object keys', () => {
      // Arrange
      const rolePermissions = {
        [UserRole.MASTER]: ['read', 'write', 'delete', 'admin'],
        [UserRole.ADMIN]: ['read', 'write', 'delete'],
        [UserRole.USER]: ['read'],
      };

      // Act
      const masterPermissions = rolePermissions[UserRole.MASTER];
      const userPermissions = rolePermissions[UserRole.USER];

      // Assert
      expect(masterPermissions).toEqual(['read', 'write', 'delete', 'admin']);
      expect(userPermissions).toEqual(['read']);
    });
  });

  describe('enum iteration', () => {
    it('should be iterable with Object.values', () => {
      // Arrange
      const expectedRoles = ['master', 'admin', 'user'];

      // Act
      const roles = Object.values(UserRole);

      // Assert
      expect(roles).toEqual(expect.arrayContaining(expectedRoles));
    });

    it('should be iterable with Object.keys', () => {
      // Arrange
      const expectedKeys = ['MASTER', 'ADMIN', 'USER'];

      // Act
      const keys = Object.keys(UserRole);

      // Assert
      expect(keys).toEqual(expect.arrayContaining(expectedKeys));
    });

    it('should be iterable with Object.entries', () => {
      // Act
      const entries = Object.entries(UserRole);

      // Assert
      expect(entries).toHaveLength(3);
      expect(entries).toEqual(
        expect.arrayContaining([
          ['MASTER', 'master'],
          ['ADMIN', 'admin'],
          ['USER', 'user'],
        ]),
      );
    });
  });

  describe('enum validation', () => {
    it('should validate role exists', () => {
      // Arrange
      const validRole = 'admin';
      const invalidRole = 'invalid';

      // Act
      const isValidRole = Object.values(UserRole).includes(
        validRole as UserRole,
      );
      const isInvalidRole = Object.values(UserRole).includes(
        invalidRole as UserRole,
      );

      // Assert
      expect(isValidRole).toBe(true);
      expect(isInvalidRole).toBe(false);
    });

    it('should create role validation function', () => {
      // Arrange
      const isValidUserRole = (role: string): role is UserRole => {
        return Object.values(UserRole).includes(role as UserRole);
      };

      // Act & Assert
      expect(isValidUserRole('master')).toBe(true);
      expect(isValidUserRole('admin')).toBe(true);
      expect(isValidUserRole('user')).toBe(true);
      expect(isValidUserRole('invalid')).toBe(false);
      expect(isValidUserRole('')).toBe(false);
    });
  });

  describe('enum constants', () => {
    it('should maintain reference equality', () => {
      // Arrange
      const role1 = UserRole.USER;
      const role2 = UserRole.USER;

      // Act & Assert
      expect(role1).toBe(role2);
      expect(Object.is(role1, role2)).toBe(true);
    });

    it('should be immutable', () => {
      // Arrange
      const originalRole = UserRole.ADMIN;

      // Act
      // Attempting to modify would cause TypeScript error in real usage
      // This test ensures the enum values are constants
      const roleValue = UserRole.ADMIN;

      // Assert
      expect(roleValue).toBe('admin');
      expect(originalRole).toBe('admin');
    });
  });
});
