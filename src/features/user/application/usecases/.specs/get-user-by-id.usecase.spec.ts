import { Test, TestingModule } from '@nestjs/testing';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { GetUserByIdUsecase } from '../get-user-by-id.usecase';

describe('GetUserByIdUsecase', () => {
  let usecase: GetUserByIdUsecase;
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
        GetUserByIdUsecase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usecase = module.get<GetUserByIdUsecase>(GetUserByIdUsecase);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    const validId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
    const invalidId = 'invalid-id';

    it('should successfully return user when found', async () => {
      // Arrange
      const mockUser = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('testuser'),
      );
      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await usecase.execute(validId);

      // Assert
      expect(result).toBe(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith(
        UlidVO.fromString(validId),
      );
    });

    it('should throw UserNotFoundException when user not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(usecase.execute(validId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(
        UlidVO.fromString(validId),
      );
    });

    it('should throw UserNotFoundException for invalid ULID format', async () => {
      // Act & Assert
      await expect(usecase.execute(invalidId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException for empty string ID', async () => {
      // Act & Assert
      await expect(usecase.execute('')).rejects.toThrow(UserNotFoundException);
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException for null ID', async () => {
      // Act & Assert
      await expect(usecase.execute(null as any)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException for undefined ID', async () => {
      // Act & Assert
      await expect(usecase.execute(undefined as any)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      userRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usecase.execute(validId)).rejects.toThrow('Database error');
    });

    it('should validate ULID format before repository call', async () => {
      // Arrange
      const malformedId = 'not-a-ulid';

      // Act & Assert
      await expect(usecase.execute(malformedId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only ID', async () => {
      // Act & Assert
      await expect(usecase.execute('   ')).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle very long invalid ID', async () => {
      // Arrange
      const longInvalidId = 'a'.repeat(100);

      // Act & Assert
      await expect(usecase.execute(longInvalidId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should return correct user properties', async () => {
      // Arrange
      const email = 'user@example.com';
      const username = 'testuser';
      const mockUser = UserEntity.createUser(
        EmailVO.create(email),
        UsernameVO.create(username),
      );
      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await usecase.execute(validId);

      // Assert
      expect(result.getEmail().value).toBe(email);
      expect(result.getUsername().value).toBe(username);
      expect(result.id()).toBeDefined();
      expect(result.createdAt()).toBeDefined();
      expect(result.updatedAt()).toBeDefined();
    });
  });
});
