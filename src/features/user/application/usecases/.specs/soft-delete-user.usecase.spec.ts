import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UserValidationService } from '../../services/user-validation.service';
import { SoftDeleteUserUsecase } from '../soft-delete-user.usecase';

describe('SoftDeleteUserUsecase', () => {
  let usecase: SoftDeleteUserUsecase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserValidationService: jest.Mocked<UserValidationService>;

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

    mockUserValidationService = {
      validateAndCreateUlid: jest.fn(),
      validatePagination: jest.fn(),
      ensureUserExists: jest.fn(),
      validateIdAndEnsureUserExists: jest.fn(),
    } as unknown as jest.Mocked<UserValidationService>;

    usecase = new SoftDeleteUserUsecase(
      mockUserRepository,
      mockUserValidationService,
    );
  });

  describe('execute', () => {
    it('should soft delete user successfully', async () => {
      // Arrange
      const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
      const userUlid = UlidVO.fromString(userId);
      const user = UserEntity.fromData(
        userUlid,
        TimestampVO.create(),
        TimestampVO.create(),
        null, // not deleted yet
        EmailVO.fromString('user@example.com'),
        UserRole.USER,
        UsernameVO.fromString('johndoe'),
      );

      mockUserValidationService.validateIdAndEnsureUserExists.mockResolvedValue(
        userUlid,
      );
      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue();

      // Act
      await usecase.execute(userId);

      // Assert
      expect(
        mockUserValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userUlid);
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.any(UserEntity),
      );
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      // Arrange
      const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
      mockUserValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(userId),
      );

      // Act & Assert
      await expect(usecase.execute(userId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        mockUserValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException when user is already deleted', async () => {
      // Arrange
      const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
      mockUserValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(userId),
      );

      // Act & Assert
      await expect(usecase.execute(userId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        mockUserValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error for invalid user ID format', async () => {
      // Arrange
      const invalidUserId = 'invalid-id';
      mockUserValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(invalidUserId),
      );

      // Act & Assert
      await expect(usecase.execute(invalidUserId)).rejects.toThrow();
      expect(
        mockUserValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(invalidUserId);
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
