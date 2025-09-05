import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { GetUsersResult, GetUsersUsecase } from '../get-users.usecase';

describe('GetUsersUsecase', () => {
  let usecase: GetUsersUsecase;
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
        GetUsersUsecase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usecase = module.get<GetUsersUsecase>(GetUsersUsecase);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should return paginated users with default parameters', async () => {
      // Arrange
      const mockUsers = [
        UserEntity.createUser(
          EmailVO.create('user1@example.com'),
          UsernameVO.create('user1'),
        ),
        UserEntity.createUser(
          EmailVO.create('user2@example.com'),
          UsernameVO.create('user2'),
        ),
      ];

      const mockResult: GetUsersResult = {
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      const result = await usecase.execute();

      // Assert
      expect(result).toEqual(mockResult);
      expect(userRepository.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should return paginated users with custom parameters', async () => {
      // Arrange
      const page = 2;
      const limit = 5;
      const mockUsers = [
        UserEntity.createUser(
          EmailVO.create('user1@example.com'),
          UsernameVO.create('user1'),
        ),
      ];

      const mockResult: GetUsersResult = {
        users: mockUsers,
        total: 6,
        page: 2,
        limit: 5,
        totalPages: 2,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      const result = await usecase.execute(page, limit);

      // Assert
      expect(result).toEqual(mockResult);
      expect(userRepository.findAll).toHaveBeenCalledWith(page, limit);
    });

    it('should handle empty user list', async () => {
      // Arrange
      const mockResult: GetUsersResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      const result = await usecase.execute();

      // Assert
      expect(result).toEqual(mockResult);
      expect(result.users).toHaveLength(0);
    });

    it('should validate and correct invalid page number', async () => {
      // Arrange
      const mockResult: GetUsersResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      await usecase.execute(0, 10);

      // Assert
      expect(userRepository.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should validate and correct negative page number', async () => {
      // Arrange
      const mockResult: GetUsersResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      await usecase.execute(-5, 10);

      // Assert
      expect(userRepository.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should validate and correct limit exceeding maximum', async () => {
      // Arrange
      const mockResult: GetUsersResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 100,
        totalPages: 0,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      await usecase.execute(1, 150);

      // Assert
      expect(userRepository.findAll).toHaveBeenCalledWith(1, 100);
    });

    it('should validate and correct limit below minimum', async () => {
      // Arrange
      const mockResult: GetUsersResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 1,
        totalPages: 0,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      await usecase.execute(1, 0);

      // Assert
      expect(userRepository.findAll).toHaveBeenCalledWith(1, 1);
    });

    it('should handle negative limit', async () => {
      // Arrange
      const mockResult: GetUsersResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 1,
        totalPages: 0,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      await usecase.execute(1, -10);

      // Assert
      expect(userRepository.findAll).toHaveBeenCalledWith(1, 1);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      userRepository.findAll.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usecase.execute()).rejects.toThrow('Database error');
    });

    it('should handle large page numbers', async () => {
      // Arrange
      const mockResult: GetUsersResult = {
        users: [],
        total: 0,
        page: 1000,
        limit: 10,
        totalPages: 0,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      const result = await usecase.execute(1000, 10);

      // Assert
      expect(result).toEqual(mockResult);
      expect(userRepository.findAll).toHaveBeenCalledWith(1000, 10);
    });

    it('should handle maximum allowed limit', async () => {
      // Arrange
      const mockResult: GetUsersResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 100,
        totalPages: 0,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      const result = await usecase.execute(1, 100);

      // Assert
      expect(result).toEqual(mockResult);
      expect(userRepository.findAll).toHaveBeenCalledWith(1, 100);
    });

    it('should return correct result structure', async () => {
      // Arrange
      const mockUsers = [
        UserEntity.createUser(
          EmailVO.create('user1@example.com'),
          UsernameVO.create('user1'),
        ),
      ];

      const mockResult: GetUsersResult = {
        users: mockUsers,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      userRepository.findAll.mockResolvedValue(mockResult);

      // Act
      const result = await usecase.execute();

      // Assert
      expect(result).toHaveProperty('users');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('totalPages');
      expect(Array.isArray(result.users)).toBe(true);
      expect(typeof result.total).toBe('number');
      expect(typeof result.page).toBe('number');
      expect(typeof result.limit).toBe('number');
      expect(typeof result.totalPages).toBe('number');
    });
  });
});
