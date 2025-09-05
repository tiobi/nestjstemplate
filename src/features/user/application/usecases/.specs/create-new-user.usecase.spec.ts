import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { EmailAlreadyExistsException } from '../../exceptions/email-already-exists.exception';
import { CreateNewUserUsecase } from '../create-new-user.usecase';

describe('CreateNewUserUsecase', () => {
  let usecase: CreateNewUserUsecase;
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
        CreateNewUserUsecase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usecase = module.get<CreateNewUserUsecase>(CreateNewUserUsecase);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    const email = 'test@example.com';
    const username = 'testuser';

    it('should successfully create a new user', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await usecase.execute(email, username);

      // Assert
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.getEmail().value).toBe(email);
      expect(result.getUsername().value).toBe(username);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        EmailVO.create(email),
      );
    });

    it('should throw BadRequestException when username is null', async () => {
      // Act & Assert
      await expect(usecase.execute(email, null)).rejects.toThrow(
        BadRequestException,
      );
      await expect(usecase.execute(email, null)).rejects.toThrow(
        'Username is required',
      );
      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when username is undefined', async () => {
      // Act & Assert
      await expect(usecase.execute(email, undefined as any)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw EmailAlreadyExistsException when email already exists', async () => {
      // Arrange
      const existingUser = UserEntity.createUser(
        EmailVO.create(email),
        UsernameVO.create('existinguser'),
      );
      userRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(usecase.execute(email, username)).rejects.toThrow(
        EmailAlreadyExistsException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        EmailVO.create(email),
      );
    });

    it('should validate email format', async () => {
      // Act & Assert
      await expect(
        usecase.execute('invalid-email', username),
      ).rejects.toThrow();
      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should validate username format', async () => {
      // Act & Assert
      await expect(usecase.execute(email, 'ab')).rejects.toThrow();
      expect(userRepository.findByEmail).toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      userRepository.findByEmail.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usecase.execute(email, username)).rejects.toThrow(
        'Database error',
      );
    });

    it('should create user with valid email and username', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await usecase.execute(email, username);

      // Assert
      expect(result.getEmail().value).toBe(email);
      expect(result.getUsername().value).toBe(username);
      expect(result.id()).toBeDefined();
      expect(result.createdAt()).toBeDefined();
      expect(result.updatedAt()).toBeDefined();
    });

    it('should handle empty string username', async () => {
      // Act & Assert
      await expect(usecase.execute(email, '')).rejects.toThrow();
      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only username', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await usecase.execute(email, '   ');

      // Assert
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.getUsername().value).toBe('   ');
      expect(userRepository.findByEmail).toHaveBeenCalled();
    });
  });
});
