import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserNotFoundException } from '../../../application/exceptions/user-not-found.exception';
import { UserEntity } from '../../../domain/entities/user.entity';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { UserRepositoryImpl } from '../user.repository.impl';

describe('UserRepositoryImpl - delete', () => {
  let repository: UserRepositoryImpl;
  let userId: UlidVO;

  beforeEach(() => {
    repository = new UserRepositoryImpl();
    userId = UlidVO.create();
  });

  it('should soft delete user successfully', async () => {
    // Arrange
    const user = UserEntity.createUser(
      EmailVO.fromString('user@example.com'),
      UsernameVO.fromString('johndoe'),
    );
    await repository.create(user);
    const userIdToDelete = user.id();

    // Act
    await repository.delete(userIdToDelete);

    // Assert
    // Check that findById returns null for deleted users (correct behavior)
    const deletedUser = await repository.findById(userIdToDelete);
    expect(deletedUser).toBeNull();

    // Check that the user is actually soft deleted by accessing the repository's internal state
    // This is a test-specific check to verify the soft delete worked
    const repositoryImpl = repository as any;
    const storedUser = repositoryImpl.mockUsers.get(userIdToDelete.value);
    expect(storedUser).not.toBeNull();
    expect(storedUser.deletedAt()).not.toBeNull();
    expect(storedUser.id().value).toBe(userIdToDelete.value);
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    // Act & Assert
    await expect(repository.delete(userId)).rejects.toThrow(
      UserNotFoundException,
    );
  });

  it('should throw UserNotFoundException when user is already deleted', async () => {
    // Arrange
    const user = UserEntity.createUser(
      EmailVO.fromString('user@example.com'),
      UsernameVO.fromString('johndoe'),
    );
    await repository.create(user);
    const userIdToDelete = user.id();
    await repository.delete(userIdToDelete); // First delete

    // Act & Assert
    await expect(repository.delete(userIdToDelete)).rejects.toThrow(
      UserNotFoundException,
    );
  });

  it('should update user with new timestamps after soft delete', async () => {
    // Arrange
    const user = UserEntity.createUser(
      EmailVO.fromString('user@example.com'),
      UsernameVO.fromString('johndoe'),
    );
    await repository.create(user);
    const userIdToDelete = user.id();
    const originalUpdatedAt = user.updatedAt();

    // Act
    await repository.delete(userIdToDelete);

    // Assert
    // Check that the user is actually soft deleted by accessing the repository's internal state
    const repositoryImpl = repository as any;
    const storedUser = repositoryImpl.mockUsers.get(userIdToDelete.value);
    expect(storedUser.updatedAt().value.getTime()).toBeGreaterThan(
      originalUpdatedAt.value.getTime(),
    );
    expect(storedUser.deletedAt()).not.toBeNull();
  });
});
