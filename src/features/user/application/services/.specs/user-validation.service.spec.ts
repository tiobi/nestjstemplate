import { Test, TestingModule } from '@nestjs/testing';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UserValidationService } from '../user-validation.service';

describe('UserValidationService', () => {
  let service: UserValidationService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findByDateRange: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserValidationService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserValidationService>(UserValidationService);
    userRepository = module.get(UserRepository);
  });

  describe('validateAndCreateUlid', () => {
    it('should return UlidVO for valid ID', () => {
      const validId = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
      const result = service.validateAndCreateUlid(validId);
      expect(result).toBeInstanceOf(UlidVO);
      expect(result.value).toBe(validId);
    });

    it('should throw UserNotFoundException for invalid ID', () => {
      const invalidId = 'invalid-id';
      expect(() => service.validateAndCreateUlid(invalidId)).toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('validatePagination', () => {
    it('should return valid pagination for normal values', () => {
      const result = service.validatePagination(2, 20);
      expect(result).toEqual({ validPage: 2, validLimit: 20 });
    });

    it('should handle default values', () => {
      const result = service.validatePagination();
      expect(result).toEqual({ validPage: 1, validLimit: 10 });
    });

    it('should clamp page to minimum 1', () => {
      const result = service.validatePagination(0, 10);
      expect(result).toEqual({ validPage: 1, validLimit: 10 });
    });

    it('should clamp limit to maximum 100', () => {
      const result = service.validatePagination(1, 150);
      expect(result).toEqual({ validPage: 1, validLimit: 100 });
    });

    it('should clamp limit to minimum 1', () => {
      const result = service.validatePagination(1, 0);
      expect(result).toEqual({ validPage: 1, validLimit: 1 });
    });
  });

  describe('ensureUserExists', () => {
    it('should not throw when user exists and is active', async () => {
      const ulid = UlidVO.create();
      const mockUser = {
        id: () => ulid,
        deletedAt: () => null,
      } as UserEntity;

      userRepository.findById.mockResolvedValue(mockUser);

      await expect(service.ensureUserExists(ulid)).resolves.not.toThrow();
    });

    it('should throw when user does not exist', async () => {
      const ulid = UlidVO.create();
      userRepository.findById.mockResolvedValue(null);

      await expect(service.ensureUserExists(ulid)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw when user is soft deleted', async () => {
      const ulid = UlidVO.create();
      const mockUser = {
        id: () => ulid,
        deletedAt: () => new Date(),
      } as UserEntity;

      userRepository.findById.mockResolvedValue(mockUser);

      await expect(service.ensureUserExists(ulid)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('validateIdAndEnsureUserExists', () => {
    it('should return UlidVO when ID is valid and user exists', async () => {
      const validId = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
      const ulid = UlidVO.fromString(validId);
      const mockUser = {
        id: () => ulid,
        deletedAt: () => null,
      } as UserEntity;

      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.validateIdAndEnsureUserExists(validId);
      expect(result).toBeInstanceOf(UlidVO);
      expect(result.value).toBe(validId);
    });

    it('should throw when ID is invalid', async () => {
      const invalidId = 'invalid-id';
      await expect(
        service.validateIdAndEnsureUserExists(invalidId),
      ).rejects.toThrow(UserNotFoundException);
    });

    it('should throw when user does not exist', async () => {
      const validId = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
      userRepository.findById.mockResolvedValue(null);

      await expect(
        service.validateIdAndEnsureUserExists(validId),
      ).rejects.toThrow(UserNotFoundException);
    });
  });
});
