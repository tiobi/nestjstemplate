import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateNewUserUsecase } from '../../../application/usecases/create-new-user.usecase';
import { GetUserByIdUsecase } from '../../../application/usecases/get-user-by-id.usecase';
import { GetUsersByDateRangeUsecase } from '../../../application/usecases/get-users-by-date-range.usecase';
import { GetUsersUsecase } from '../../../application/usecases/get-users.usecase';
import { SoftDeleteUserUsecase } from '../../../application/usecases/soft-delete-user.usecase';
import { UpdateUserUsecase } from '../../../application/usecases/update-user.usecase';
import { UserController } from '../user.controller';

describe('UserController - deleteUser', () => {
  let controller: UserController;
  let mockSoftDeleteUserUsecase: jest.Mocked<SoftDeleteUserUsecase>;

  beforeEach(async () => {
    mockSoftDeleteUserUsecase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SoftDeleteUserUsecase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: SoftDeleteUserUsecase,
          useValue: mockSoftDeleteUserUsecase,
        },
        // Mock other dependencies
        {
          provide: CreateNewUserUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetUserByIdUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetUsersUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetUsersByDateRangeUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateUserUsecase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('deleteUser', () => {
    it('should soft delete user successfully', async () => {
      // Arrange
      const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
      mockSoftDeleteUserUsecase.execute.mockResolvedValue();

      // Act
      const result = await controller.deleteUser(userId);

      // Assert
      expect(mockSoftDeleteUserUsecase.execute).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        message: 'User successfully deleted',
        userId,
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
      mockSoftDeleteUserUsecase.execute.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(controller.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockSoftDeleteUserUsecase.execute).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user is already deleted', async () => {
      // Arrange
      const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
      mockSoftDeleteUserUsecase.execute.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(controller.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockSoftDeleteUserUsecase.execute).toHaveBeenCalledWith(userId);
    });

    it('should propagate validation errors for invalid user ID', async () => {
      // Arrange
      const invalidUserId = 'invalid-id';
      mockSoftDeleteUserUsecase.execute.mockRejectedValue(
        new Error('Invalid ULID'),
      );

      // Act & Assert
      await expect(controller.deleteUser(invalidUserId)).rejects.toThrow();
      expect(mockSoftDeleteUserUsecase.execute).toHaveBeenCalledWith(
        invalidUserId,
      );
    });
  });
});
