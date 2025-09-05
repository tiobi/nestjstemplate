import { NotFoundException } from '@nestjs/common';
import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { SoftDeleteUserUsecase } from '../soft-delete-user.usecase';

describe('SoftDeleteUserUsecase', () => {
  let usecase: SoftDeleteUserUsecase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByDateRange: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    usecase = new SoftDeleteUserUsecase(mockUserRepository);
  });

  describe('execute', () => {
    it('should soft delete user successfully', async () => {
      // Arrange
      const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
      const user = UserEntity.fromData(
        UlidVO.fromString(userId),
        TimestampVO.create(),
        TimestampVO.create(),
        null, // not deleted yet
        EmailVO.fromString('user@example.com'),
        UserRole.USER,
        UsernameVO.fromString('johndoe'),
      );

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue();

      // Act
      await usecase.execute(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        UlidVO.fromString(userId),
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.any(UserEntity),
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(usecase.execute(userId)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        UlidVO.fromString(userId),
      );
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is already deleted', async () => {
      // Arrange
      const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
      const deletedUser = UserEntity.fromData(
        UlidVO.fromString(userId),
        TimestampVO.create(),
        TimestampVO.create(),
        TimestampVO.create(), // already deleted
        EmailVO.fromString('user@example.com'),
        UserRole.USER,
        UsernameVO.fromString('johndoe'),
      );

      mockUserRepository.findById.mockResolvedValue(deletedUser);

      // Act & Assert
      await expect(usecase.execute(userId)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        UlidVO.fromString(userId),
      );
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error for invalid user ID format', async () => {
      // Arrange
      const invalidUserId = 'invalid-id';

      // Act & Assert
      await expect(usecase.execute(invalidUserId)).rejects.toThrow();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
