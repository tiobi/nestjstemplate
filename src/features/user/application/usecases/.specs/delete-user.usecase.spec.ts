import { Test, TestingModule } from '@nestjs/testing';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UserValidationService } from '../../services/user-validation.service';
import { DeleteUserUsecase } from '../delete-user.usecase';

describe('DeleteUserUsecase', () => {
  let usecase: DeleteUserUsecase;
  let userRepository: jest.Mocked<UserRepository>;
  let userValidationService: jest.Mocked<UserValidationService>;

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

    const mockUserValidationService = {
      validateAndCreateUlid: jest.fn(),
      validatePagination: jest.fn(),
      ensureUserExists: jest.fn(),
      validateIdAndEnsureUserExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUsecase,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: UserValidationService,
          useValue: mockUserValidationService,
        },
      ],
    }).compile();

    usecase = module.get<DeleteUserUsecase>(DeleteUserUsecase);
    userRepository = module.get(UserRepository);
    userValidationService = module.get(UserValidationService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    const validId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
    const invalidId = 'invalid-id';

    it('should successfully delete user when found', async () => {
      // Arrange
      const userUlid = UlidVO.fromString(validId);
      userValidationService.validateIdAndEnsureUserExists.mockResolvedValue(
        userUlid,
      );
      userRepository.delete.mockResolvedValue();

      // Act
      await usecase.execute(validId);

      // Assert
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(validId);
      expect(userRepository.delete).toHaveBeenCalledWith(userUlid);
    });

    it('should throw UserNotFoundException when user not found', async () => {
      // Arrange
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(validId),
      );

      // Act & Assert
      await expect(usecase.execute(validId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(validId);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException for invalid ULID format', async () => {
      // Arrange
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(invalidId),
      );

      // Act & Assert
      await expect(usecase.execute(invalidId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(invalidId);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException for empty string ID', async () => {
      // Arrange
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(''),
      );

      // Act & Assert
      await expect(usecase.execute('')).rejects.toThrow(UserNotFoundException);
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith('');
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException for null ID', async () => {
      // Arrange
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException('null'),
      );

      // Act & Assert
      await expect(usecase.execute(null as any)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(null);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException for undefined ID', async () => {
      // Arrange
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException('undefined'),
      );

      // Act & Assert
      await expect(usecase.execute(undefined as any)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(undefined);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository findById errors gracefully', async () => {
      // Arrange
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(usecase.execute(validId)).rejects.toThrow('Database error');
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(validId);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository delete errors gracefully', async () => {
      // Arrange
      const userUlid = UlidVO.fromString(validId);
      userValidationService.validateIdAndEnsureUserExists.mockResolvedValue(
        userUlid,
      );
      userRepository.delete.mockRejectedValue(new Error('Delete failed'));

      // Act & Assert
      await expect(usecase.execute(validId)).rejects.toThrow('Delete failed');
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(validId);
      expect(userRepository.delete).toHaveBeenCalledWith(userUlid);
    });

    it('should validate ULID format before repository calls', async () => {
      // Arrange
      const malformedId = 'not-a-ulid';
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(malformedId),
      );

      // Act & Assert
      await expect(usecase.execute(malformedId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(malformedId);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only ID', async () => {
      // Arrange
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException('   '),
      );

      // Act & Assert
      await expect(usecase.execute('   ')).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith('   ');
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle very long invalid ID', async () => {
      // Arrange
      const longInvalidId = 'a'.repeat(100);
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(longInvalidId),
      );

      // Act & Assert
      await expect(usecase.execute(longInvalidId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(longInvalidId);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should call repository methods in correct order', async () => {
      // Arrange
      const userUlid = UlidVO.fromString(validId);
      userValidationService.validateIdAndEnsureUserExists.mockResolvedValue(
        userUlid,
      );
      userRepository.delete.mockResolvedValue();

      // Act
      await usecase.execute(validId);

      // Assert
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledTimes(1);
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(validId);
      expect(userRepository.delete).toHaveBeenCalledWith(userUlid);
    });

    it('should not call delete when user is not found', async () => {
      // Arrange
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(validId),
      );

      // Act & Assert
      await expect(usecase.execute(validId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledTimes(0);
    });

    it('should handle special characters in ID', async () => {
      // Arrange
      const specialCharId = '01K4BTM6CK2Q6V8HP7XA9M63DH@#$%';
      userValidationService.validateIdAndEnsureUserExists.mockRejectedValue(
        new UserNotFoundException(specialCharId),
      );

      // Act & Assert
      await expect(usecase.execute(specialCharId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(
        userValidationService.validateIdAndEnsureUserExists,
      ).toHaveBeenCalledWith(specialCharId);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });
  });
});
