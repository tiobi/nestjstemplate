import { UlidVO } from '../ulid.vo';

describe('UlidVO', () => {
  describe('create', () => {
    it('should create a valid ULID', () => {
      // Arrange & Act
      const ulid = UlidVO.create();

      // Assert
      expect(ulid.value).toMatch(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i);
      expect(ulid.value).toHaveLength(26);
    });

    it('should create unique ULIDs', () => {
      // Arrange & Act
      const ulid1 = UlidVO.create();
      const ulid2 = UlidVO.create();

      // Assert
      expect(ulid1.value).not.toBe(ulid2.value);
    });

    it('should create monotonically increasing ULIDs', () => {
      // Arrange & Act
      const ulid1 = UlidVO.create();
      const ulid2 = UlidVO.create();
      const ulid3 = UlidVO.create();

      // Assert
      expect(ulid1.value < ulid2.value).toBe(true);
      expect(ulid2.value < ulid3.value).toBe(true);
    });
  });

  describe('fromString', () => {
    it('should create a valid ULID from string', () => {
      // Arrange
      const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';

      // Act
      const ulid = UlidVO.fromString(validUlid);

      // Assert
      expect(ulid.value).toBe(validUlid);
    });

    it('should create ULID with lowercase characters', () => {
      // Arrange
      const validUlid = '01arz3ndektsv4rrffq69g5fav';

      // Act
      const ulid = UlidVO.fromString(validUlid);

      // Assert
      expect(ulid.value).toBe(validUlid);
    });

    it('should throw error for empty string', () => {
      // Arrange
      const emptyString = '';

      // Act & Assert
      expect(() => UlidVO.fromString(emptyString)).toThrow(
        'Invalid ULID format: ',
      );
    });

    it('should throw error for null/undefined', () => {
      // Arrange
      const nullValue = null as any;

      // Act & Assert
      expect(() => UlidVO.fromString(nullValue)).toThrow(
        'Invalid ULID format: null',
      );
    });

    it('should throw error for string too short', () => {
      // Arrange
      const shortString = '01ARZ3NDEKTSV4RRFFQ69G5FA';

      // Act & Assert
      expect(() => UlidVO.fromString(shortString)).toThrow(
        'Invalid ULID format: 01ARZ3NDEKTSV4RRFFQ69G5FA',
      );
    });

    it('should throw error for string too long', () => {
      // Arrange
      const longString = '01ARZ3NDEKTSV4RRFFQ69G5FAVX';

      // Act & Assert
      expect(() => UlidVO.fromString(longString)).toThrow(
        'Invalid ULID format: 01ARZ3NDEKTSV4RRFFQ69G5FAVX',
      );
    });

    it('should throw error for string with invalid characters', () => {
      // Arrange
      const invalidString = '01ARZ3NDEKTSV4RRFFQ69G5FAI'; // Contains 'I' which is invalid

      // Act & Assert
      expect(() => UlidVO.fromString(invalidString)).toThrow(
        'Invalid ULID format: 01ARZ3NDEKTSV4RRFFQ69G5FAI',
      );
    });

    it('should throw error for string with special characters', () => {
      // Arrange
      const specialString = '01ARZ3NDEKTSV4RRFFQ69G5FA!';

      // Act & Assert
      expect(() => UlidVO.fromString(specialString)).toThrow(
        'Invalid ULID format: 01ARZ3NDEKTSV4RRFFQ69G5FA!',
      );
    });

    it('should throw error for string with spaces', () => {
      // Arrange
      const spaceString = '01ARZ3NDEKTSV4RRFFQ69G5FA ';

      // Act & Assert
      expect(() => UlidVO.fromString(spaceString)).toThrow(
        'Invalid ULID format: 01ARZ3NDEKTSV4RRFFQ69G5FA ',
      );
    });
  });

  describe('value getter', () => {
    it('should return the ULID value', () => {
      // Arrange
      const ulidValue = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
      const ulid = UlidVO.fromString(ulidValue);

      // Act
      const result = ulid.value;

      // Assert
      expect(result).toBe(ulidValue);
    });

    it('should return immutable value', () => {
      // Arrange
      const ulidValue = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
      const ulid = UlidVO.fromString(ulidValue);

      // Act
      const result = ulid.value;

      // Assert
      expect(result).toBe(ulidValue);
      expect(result).toBe(ulid.value); // Should return the same value consistently
    });
  });

  describe('edge cases', () => {
    it('should handle valid ULID with all valid characters', () => {
      // Arrange
      const validUlid = '0123456789ABCDEFGHJKMNPQRS'; // 26 characters

      // Act
      const ulid = UlidVO.fromString(validUlid);

      // Assert
      expect(ulid.value).toBe(validUlid);
    });

    it('should handle ULID with zeros', () => {
      // Arrange
      const zeroUlid = '00000000000000000000000000';

      // Act
      const ulid = UlidVO.fromString(zeroUlid);

      // Assert
      expect(ulid.value).toBe(zeroUlid);
    });

    it('should handle ULID with maximum valid characters', () => {
      // Arrange
      const maxUlid = 'ZZZZZZZZZZZZZZZZZZZZZZZZZZ';

      // Act
      const ulid = UlidVO.fromString(maxUlid);

      // Assert
      expect(ulid.value).toBe(maxUlid);
    });
  });

  describe('monotonic factory', () => {
    it('should create ULIDs that are lexicographically sortable', () => {
      // Arrange & Act
      const ulids: UlidVO[] = [];
      for (let i = 0; i < 10; i++) {
        ulids.push(UlidVO.create());
      }

      // Assert
      for (let i = 1; i < ulids.length; i++) {
        expect(ulids[i - 1].value < ulids[i].value).toBe(true);
      }
    });

    it('should create ULIDs with different timestamps', () => {
      // Arrange & Act
      const ulid1 = UlidVO.create();

      // Small delay to ensure different timestamp
      const start = Date.now();
      while (Date.now() - start < 1) {
        // Wait for at least 1ms
      }

      const ulid2 = UlidVO.create();

      // Assert
      expect(ulid1.value).not.toBe(ulid2.value);
      expect(ulid1.value < ulid2.value).toBe(true);
    });
  });
});
