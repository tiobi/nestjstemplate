import { Test, TestingModule } from '@nestjs/testing';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UpdateUserUsecase } from '../update-user.usecase';

describe('UpdateUserUsecase', () => {
  let usecase: UpdateUserUsecase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUsecase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usecase = module.get<UpdateUserUsecase>(UpdateUserUsecase);
    userRepository = module.get(UserRepository);
  });

  describe('execute', () => {
    const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
    const newUsername = 'newusername';

    it('should successfully update user username', async () => {
      // Arrange
      const existingUser = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('oldusername'),
      );
      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.update.mockResolvedValue();

      // Act
      const result = await usecase.execute(userId, newUsername);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(
        UlidVO.fromString(userId),
      );
      expect(userRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          getUsername: expect.any(Function),
        }),
      );
      expect(result.getUsername().value).toBe(newUsername);
    });

    it('should throw UserNotFoundException when user not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(usecase.execute(userId, newUsername)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(
        UlidVO.fromString(userId),
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should update user with new username and preserve other properties', async () => {
      // Arrange
      const existingUser = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('oldusername'),
      );
      const originalEmail = existingUser.getEmail();
      const originalId = existingUser.id();
      const originalCreatedAt = existingUser.createdAt();

      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.update.mockResolvedValue();

      // Act
      const result = await usecase.execute(userId, newUsername);

      // Assert
      expect(result.id()).toBe(originalId);
      expect(result.getEmail()).toBe(originalEmail);
      expect(result.getUsername().value).toBe(newUsername);
      expect(result.createdAt()).toBe(originalCreatedAt);
      expect(result.updatedAt().value).not.toBe(originalCreatedAt.value);
    });

    it('should handle username validation errors', async () => {
      // Arrange
      const existingUser = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('oldusername'),
      );
      userRepository.findById.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(usecase.execute(userId, 'ab')).rejects.toThrow();
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate repository update errors', async () => {
      // Arrange
      const existingUser = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('oldusername'),
      );
      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.update.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usecase.execute(userId, newUsername)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
