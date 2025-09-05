import { Test, TestingModule } from '@nestjs/testing';
import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { GetUsersByDateRangeUsecase } from '../get-users-by-date-range.usecase';

describe('GetUsersByDateRangeUsecase', () => {
  let usecase: GetUsersByDateRangeUsecase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByDateRange: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersByDateRangeUsecase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usecase = module.get<GetUsersByDateRangeUsecase>(
      GetUsersByDateRangeUsecase,
    );
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should return users within date range', async () => {
      // Arrange
      const startDate = '2024-01-01T00:00:00.000Z';
      const endDate = '2024-12-31T23:59:59.999Z';
      const page = 1;
      const limit = 10;

      const mockUser = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('testuser'),
      );

      const mockResult = {
        users: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const findByDateRangeSpy = jest.spyOn(userRepository, 'findByDateRange');
      findByDateRangeSpy.mockResolvedValue(mockResult);

      // Act
      const result = await usecase.execute(startDate, endDate, page, limit);

      // Assert
      expect(result).toEqual(mockResult);
      expect(findByDateRangeSpy).toHaveBeenCalledWith(
        TimestampVO.fromString(startDate),
        TimestampVO.fromString(endDate),
        page,
        limit,
      );
    });

    it('should handle null dates correctly', async () => {
      // Arrange
      const page = 1;
      const limit = 10;

      const mockResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      const findByDateRangeSpy = jest.spyOn(userRepository, 'findByDateRange');
      findByDateRangeSpy.mockResolvedValue(mockResult);

      // Act
      const result = await usecase.execute(undefined, undefined, page, limit);

      // Assert
      expect(result).toEqual(mockResult);
      expect(findByDateRangeSpy).toHaveBeenCalledWith(null, null, page, limit);
    });

    it('should validate pagination parameters', async () => {
      // Arrange
      const mockResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      const findByDateRangeSpy = jest.spyOn(userRepository, 'findByDateRange');
      findByDateRangeSpy.mockResolvedValue(mockResult);

      // Act
      await usecase.execute(undefined, undefined, 0, 150);

      // Assert
      expect(findByDateRangeSpy).toHaveBeenCalledWith(
        null,
        null,
        1, // Should be corrected to minimum value
        100, // Should be corrected to maximum value
      );
    });

    it('should throw error when start date is after end date', async () => {
      // Arrange
      const startDate = '2024-12-31T23:59:59.999Z';
      const endDate = '2024-01-01T00:00:00.000Z';

      // Act & Assert
      await expect(usecase.execute(startDate, endDate, 1, 10)).rejects.toThrow(
        'Start date must be before or equal to end date',
      );
    });
  });
});
