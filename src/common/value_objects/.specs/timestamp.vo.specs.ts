import { TimestampVO } from '../timestamp.vo';

describe('TimestampVO', () => {
  describe('create', () => {
    it('should create a timestamp with current time', () => {
      // Arrange
      const beforeCreate = new Date();

      // Act
      const timestamp = TimestampVO.create();
      const afterCreate = new Date();

      // Assert
      expect(timestamp.value).toBeInstanceOf(Date);
      expect(timestamp.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(timestamp.value.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime(),
      );
    });

    it('should create different timestamps when called multiple times', () => {
      // Arrange & Act
      const timestamp1 = TimestampVO.create();

      // Small delay to ensure different timestamps
      const start = Date.now();
      while (Date.now() - start < 1) {
        // Wait for at least 1ms
      }

      const timestamp2 = TimestampVO.create();

      // Assert
      expect(timestamp1.value.getTime()).toBeLessThan(
        timestamp2.value.getTime(),
      );
    });
  });

  describe('fromDate', () => {
    it('should create a timestamp from a specific date', () => {
      // Arrange
      const specificDate = new Date('2024-01-01T12:00:00.000Z');

      // Act
      const timestamp = TimestampVO.fromDate(specificDate);

      // Assert
      expect(timestamp.value).toEqual(specificDate);
    });

    it('should create a new Date object (not reference)', () => {
      // Arrange
      const originalDate = new Date('2024-01-01T12:00:00.000Z');

      // Act
      const timestamp = TimestampVO.fromDate(originalDate);

      // Assert
      expect(timestamp.value).toEqual(originalDate);
      expect(timestamp.value).not.toBe(originalDate); // Different object reference
    });

    it('should handle date with milliseconds', () => {
      // Arrange
      const dateWithMs = new Date('2024-01-01T12:00:00.123Z');

      // Act
      const timestamp = TimestampVO.fromDate(dateWithMs);

      // Assert
      expect(timestamp.value).toEqual(dateWithMs);
      expect(timestamp.value.getMilliseconds()).toBe(123);
    });

    it('should handle date in different timezone', () => {
      // Arrange
      const dateInTimezone = new Date('2024-01-01T12:00:00+05:00');

      // Act
      const timestamp = TimestampVO.fromDate(dateInTimezone);

      // Assert
      expect(timestamp.value).toEqual(dateInTimezone);
    });
  });

  describe('fromString', () => {
    it('should create a timestamp from valid ISO string', () => {
      // Arrange
      const isoString = '2024-01-01T12:00:00.000Z';

      // Act
      const timestamp = TimestampVO.fromString(isoString);

      // Assert
      expect(timestamp.value).toEqual(new Date(isoString));
    });

    it('should create a timestamp from date string', () => {
      // Arrange
      const dateString = '2024-01-01';

      // Act
      const timestamp = TimestampVO.fromString(dateString);

      // Assert
      expect(timestamp.value).toEqual(new Date(dateString));
    });

    it('should create a timestamp from datetime string', () => {
      // Arrange
      const datetimeString = '2024-01-01 12:00:00';

      // Act
      const timestamp = TimestampVO.fromString(datetimeString);

      // Assert
      expect(timestamp.value).toEqual(new Date(datetimeString));
    });

    it('should throw error for invalid date string', () => {
      // Arrange
      const invalidString = 'invalid-date';

      // Act & Assert
      expect(() => TimestampVO.fromString(invalidString)).toThrow(
        'Invalid date string: invalid-date',
      );
    });

    it('should throw error for empty string', () => {
      // Arrange
      const emptyString = '';

      // Act & Assert
      expect(() => TimestampVO.fromString(emptyString)).toThrow(
        'Invalid date string: ',
      );
    });

    it('should handle null string as epoch time', () => {
      // Arrange
      const nullString = null as any;

      // Act
      const timestamp = TimestampVO.fromString(nullString);

      // Assert
      expect(timestamp.value).toEqual(new Date(0)); // Epoch time
    });

    it('should throw error for undefined string', () => {
      // Arrange
      const undefinedString = undefined as any;

      // Act & Assert
      expect(() => TimestampVO.fromString(undefinedString)).toThrow(
        'Invalid date string: undefined',
      );
    });
  });

  describe('value getter', () => {
    it('should return the timestamp value', () => {
      // Arrange
      const specificDate = new Date('2024-01-01T12:00:00.000Z');
      const timestamp = TimestampVO.fromDate(specificDate);

      // Act
      const result = timestamp.value;

      // Assert
      expect(result).toEqual(specificDate);
    });

    it('should return immutable value reference', () => {
      // Arrange
      const specificDate = new Date('2024-01-01T12:00:00.000Z');
      const timestamp = TimestampVO.fromDate(specificDate);

      // Act
      const result = timestamp.value;

      // Assert
      expect(result).toBe(timestamp.value); // Same object reference
    });
  });

  describe('toJsonFormat', () => {
    it('should return ISO string format', () => {
      // Arrange
      const specificDate = new Date('2024-01-01T12:00:00.000Z');
      const timestamp = TimestampVO.fromDate(specificDate);

      // Act
      const result = timestamp.toJsonFormat();

      // Assert
      expect(result).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should return consistent ISO format', () => {
      // Arrange
      const timestamp = TimestampVO.create();

      // Act
      const result1 = timestamp.toJsonFormat();
      const result2 = timestamp.toJsonFormat();

      // Assert
      expect(result1).toBe(result2);
      expect(result1).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should handle different timezones correctly', () => {
      // Arrange
      const dateInTimezone = new Date('2024-01-01T12:00:00+05:00');
      const timestamp = TimestampVO.fromDate(dateInTimezone);

      // Act
      const result = timestamp.toJsonFormat();

      // Assert
      expect(result).toBe('2024-01-01T07:00:00.000Z'); // Converted to UTC
    });
  });

  describe('update', () => {
    it('should update to provided date', () => {
      // Arrange
      const originalDate = new Date('2024-01-01T12:00:00.000Z');
      const newDate = new Date('2024-02-01T15:30:00.000Z');
      const timestamp = TimestampVO.fromDate(originalDate);

      // Act
      const result = timestamp.update(newDate);

      // Assert
      expect(result).toEqual(newDate);
      expect(timestamp.value).toEqual(newDate);
    });

    it('should update to current time when no date provided', () => {
      // Arrange
      const originalDate = new Date('2024-01-01T12:00:00.000Z');
      const timestamp = TimestampVO.fromDate(originalDate);
      const beforeUpdate = new Date();

      // Act
      const result = timestamp.update();
      const afterUpdate = new Date();

      // Assert
      expect(result.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
      expect(timestamp.value).toEqual(result);
    });

    it('should return the updated date', () => {
      // Arrange
      const originalDate = new Date('2024-01-01T12:00:00.000Z');
      const newDate = new Date('2024-02-01T15:30:00.000Z');
      const timestamp = TimestampVO.fromDate(originalDate);

      // Act
      const result = timestamp.update(newDate);

      // Assert
      expect(result).toBe(timestamp.value);
    });

    it('should handle multiple updates', () => {
      // Arrange
      const originalDate = new Date('2024-01-01T12:00:00.000Z');
      const firstUpdate = new Date('2024-02-01T15:30:00.000Z');
      const secondUpdate = new Date('2024-03-01T18:45:00.000Z');
      const timestamp = TimestampVO.fromDate(originalDate);

      // Act
      timestamp.update(firstUpdate);
      const result = timestamp.update(secondUpdate);

      // Assert
      expect(result).toEqual(secondUpdate);
      expect(timestamp.value).toEqual(secondUpdate);
    });
  });

  describe('edge cases', () => {
    it('should handle leap year date', () => {
      // Arrange
      const leapYearDate = new Date('2024-02-29T12:00:00.000Z');

      // Act
      const timestamp = TimestampVO.fromDate(leapYearDate);

      // Assert
      expect(timestamp.value).toEqual(leapYearDate);
    });

    it('should handle year 2000', () => {
      // Arrange
      const y2kDate = new Date('2000-01-01T00:00:00.000Z');

      // Act
      const timestamp = TimestampVO.fromDate(y2kDate);

      // Assert
      expect(timestamp.value).toEqual(y2kDate);
    });

    it('should handle very old date', () => {
      // Arrange
      const oldDate = new Date('1900-01-01T00:00:00.000Z');

      // Act
      const timestamp = TimestampVO.fromDate(oldDate);

      // Assert
      expect(timestamp.value).toEqual(oldDate);
    });

    it('should handle future date', () => {
      // Arrange
      const futureDate = new Date('2100-01-01T00:00:00.000Z');

      // Act
      const timestamp = TimestampVO.fromDate(futureDate);

      // Assert
      expect(timestamp.value).toEqual(futureDate);
    });

    it('should handle date with maximum milliseconds', () => {
      // Arrange
      const maxMsDate = new Date('2024-01-01T12:00:00.999Z');

      // Act
      const timestamp = TimestampVO.fromDate(maxMsDate);

      // Assert
      expect(timestamp.value).toEqual(maxMsDate);
      expect(timestamp.value.getMilliseconds()).toBe(999);
    });
  });
});
