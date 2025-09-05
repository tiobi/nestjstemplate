import { UserNotFoundException } from '../../../application/exceptions/user-not-found.exception';
import { UserEntity } from '../../../domain/entities/user.entity';
import { EmailVO } from '../../../domain/value_objects/email.vo';
import { UsernameVO } from '../../../domain/value_objects/username.vo';
import { UserRepositoryImpl } from '../user.repository.impl';

describe('UserRepositoryImpl - Update', () => {
  let repository: UserRepositoryImpl;

  beforeEach(() => {
    repository = new UserRepositoryImpl();
  });

  describe('update', () => {
    it('should successfully update existing user', async () => {
      // Arrange
      const user = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('oldusername'),
      );
      await repository.create(user);

      const updatedUser = user.updateUser(
        undefined,
        UsernameVO.create('newusername'),
      );

      // Act
      await repository.update(updatedUser);

      // Assert
      const retrievedUser = await repository.findById(user.id());
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.getUsername().value).toBe('newusername');
      expect(retrievedUser?.getEmail().value).toBe('test@example.com');
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      // Arrange
      const nonExistentUser = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('username'),
      );

      // Act & Assert
      await expect(repository.update(nonExistentUser)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw UserNotFoundException when user is soft deleted', async () => {
      // Arrange
      const user = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('username'),
      );
      await repository.create(user);
      await repository.delete(user.id());

      const updatedUser = user.updateUser(
        undefined,
        UsernameVO.create('newusername'),
      );

      // Act & Assert
      await expect(repository.update(updatedUser)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should preserve user ID and other properties during update', async () => {
      // Arrange
      const user = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('oldusername'),
      );
      await repository.create(user);

      const originalId = user.id();
      const originalEmail = user.getEmail();
      const originalCreatedAt = user.createdAt();

      const updatedUser = user.updateUser(
        undefined,
        UsernameVO.create('newusername'),
      );

      // Act
      await repository.update(updatedUser);

      // Assert
      const retrievedUser = await repository.findById(originalId);
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.id()).toBe(originalId);
      expect(retrievedUser?.getEmail()).toBe(originalEmail);
      expect(retrievedUser?.createdAt()).toBe(originalCreatedAt);
      expect(retrievedUser?.getUsername().value).toBe('newusername');
      expect(retrievedUser?.updatedAt().value).not.toBe(
        originalCreatedAt.value,
      );
    });

    it('should handle multiple updates to the same user', async () => {
      // Arrange
      const user = UserEntity.createUser(
        EmailVO.create('test@example.com'),
        UsernameVO.create('username1'),
      );
      await repository.create(user);

      // Act
      const updatedUser1 = user.updateUser(
        undefined,
        UsernameVO.create('username2'),
      );
      await repository.update(updatedUser1);

      const updatedUser2 = updatedUser1.updateUser(
        undefined,
        UsernameVO.create('username3'),
      );
      await repository.update(updatedUser2);

      // Assert
      const retrievedUser = await repository.findById(user.id());
      expect(retrievedUser?.getUsername().value).toBe('username3');
    });
  });
});
