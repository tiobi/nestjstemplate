import { Test, TestingModule } from '@nestjs/testing';
import { CreateNewUserUsecase } from '../../../application/usecases/create-new-user.usecase';
import { GetUserByIdUsecase } from '../../../application/usecases/get-user-by-id.usecase';
import { GetUsersByDateRangeUsecase } from '../../../application/usecases/get-users-by-date-range.usecase';
import { GetUsersUsecase } from '../../../application/usecases/get-users.usecase';
import { SoftDeleteUserUsecase } from '../../../application/usecases/soft-delete-user.usecase';
import { UpdateUserUsecase } from '../../../application/usecases/update-user.usecase';
import { UserEntity } from '../../../domain/entities/user.entity';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { UserController } from '../user.controller';

describe('UserController - Update User', () => {
  let controller: UserController;
  let updateUserUsecase: jest.Mocked<UpdateUserUsecase>;

  beforeEach(async () => {
    const mockUpdateUserUsecase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UpdateUserUsecase,
          useValue: mockUpdateUserUsecase,
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
          provide: SoftDeleteUserUsecase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    updateUserUsecase = module.get(UpdateUserUsecase);
  });

  describe('updateUser', () => {
    const userId = '01K4BTM6CK2Q6V8HP7XA9M63DH';
    const updateUserRequestDto = {
      username: 'newusername',
    };

    it('should successfully update user and return response DTO', async () => {
      // Arrange
      const updatedUser = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('newusername'),
      );
      updateUserUsecase.execute.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.updateUser(userId, updateUserRequestDto);

      // Assert
      expect(updateUserUsecase.execute).toHaveBeenCalledWith(
        userId,
        updateUserRequestDto.username,
      );
      expect(result).toEqual({
        id: updatedUser.id().value,
        email: updatedUser.getEmail().value,
        username: updatedUser.getUsername().value,
        createdAt: updatedUser.createdAt().value.toISOString(),
        updatedAt: updatedUser.updatedAt().value.toISOString(),
        deletedAt: updatedUser.deletedAt()?.value?.toISOString() || null,
      });
    });

    it('should propagate usecase errors', async () => {
      // Arrange
      const error = new Error('User not found');
      updateUserUsecase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.updateUser(userId, updateUserRequestDto),
      ).rejects.toThrow('User not found');
    });

    it('should handle validation errors from ReservedUsernamePipe', async () => {
      // Arrange
      const invalidRequestDto = {
        username: 'admin', // Reserved username
      };

      // Act & Assert
      await expect(
        controller.updateUser(userId, invalidRequestDto),
      ).rejects.toThrow();
    });
  });
});
