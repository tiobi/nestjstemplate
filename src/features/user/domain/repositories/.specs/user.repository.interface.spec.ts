import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserEntity } from '../../entities/user.entity';
import { EmailVO } from '../../value_objects/email.vo';
import { UsernameVO } from '../../value_objects/username.vo';
import { UserRepository } from '../user.repository.interface';

/**
 * Test implementation of UserRepository for testing purposes
 */
class TestUserRepository extends UserRepository {
  private users: Map<string, UserEntity> = new Map();
  async create(user: UserEntity): Promise<void> {
    await Promise.resolve();
    this.users.set(user.id().value, user);
  }

  async findByEmail(email: EmailVO): Promise<UserEntity | null> {
    await Promise.resolve();
    for (const user of this.users.values()) {
      if (user.getEmail().value === email.value) {
        return user;
      }
    }
    return null;
  }

  async findById(id: UlidVO): Promise<UserEntity | null> {
    await Promise.resolve();
    return this.users.get(id.value) || null;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{
    users: UserEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    await Promise.resolve();
    const allUsers = Array.from(this.users.values());
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const users = allUsers.slice(startIndex, endIndex);
    const total = allUsers.length;
    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findByDateRange(
    startDate: TimestampVO | null,
    endDate: TimestampVO | null,
    page: number,
    limit: number,
  ): Promise<{
    users: UserEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    await Promise.resolve();
    let filteredUsers = Array.from(this.users.values());

    if (startDate) {
      filteredUsers = filteredUsers.filter(
        (user) => user.createdAt().value >= startDate.value,
      );
    }

    if (endDate) {
      filteredUsers = filteredUsers.filter(
        (user) => user.createdAt().value <= endDate.value,
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const users = filteredUsers.slice(startIndex, endIndex);
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async update(user: UserEntity): Promise<void> {
    await Promise.resolve();
    this.users.set(user.id().value, user);
  }

  async delete(id: UlidVO): Promise<void> {
    await Promise.resolve();
    this.users.delete(id.value);
  }
}

describe('UserRepository', () => {
  let repository: TestUserRepository;
  let testUser: UserEntity;

  beforeEach(() => {
    repository = new TestUserRepository();
    testUser = UserEntity.createUser(
      EmailVO.fromString('test@example.com'),
      UsernameVO.fromString('testuser'),
    );
  });

  describe('create', () => {
    it('should create a user', async () => {
      // Act
      await repository.create(testUser);

      // Assert
      const foundUser = await repository.findById(testUser.id());
      expect(foundUser).not.toBeNull();
      expect(foundUser?.id().value).toBe(testUser.id().value);
    });

    it('should create multiple users', async () => {
      // Arrange
      const user1 = UserEntity.createUser(
        EmailVO.fromString('user1@example.com'),
        UsernameVO.fromString('user1'),
      );
      const user2 = UserEntity.createUser(
        EmailVO.fromString('user2@example.com'),
        UsernameVO.fromString('user2'),
      );

      // Act
      await repository.create(user1);
      await repository.create(user2);

      // Assert
      const foundUser1 = await repository.findById(user1.id());
      const foundUser2 = await repository.findById(user2.id());
      expect(foundUser1).not.toBeNull();
      expect(foundUser2).not.toBeNull();
      expect(foundUser1?.id().value).toBe(user1.id().value);
      expect(foundUser2?.id().value).toBe(user2.id().value);
    });
  });

  describe('findByEmail', () => {
    beforeEach(async () => {
      await repository.create(testUser);
    });

    it('should find user by email', async () => {
      // Arrange
      const email = EmailVO.fromString('test@example.com');

      // Act
      const foundUser = await repository.findByEmail(email);

      // Assert
      expect(foundUser).not.toBeNull();
      expect(foundUser?.getEmail().value).toBe('test@example.com');
    });

    it('should return null when user not found', async () => {
      // Arrange
      const email = EmailVO.fromString('nonexistent@example.com');

      // Act
      const foundUser = await repository.findByEmail(email);

      // Assert
      expect(foundUser).toBeNull();
    });

    it('should find user with different email formats', async () => {
      // Arrange
      const complexEmail = EmailVO.fromString('user.name+tag@example.com');
      const userWithComplexEmail = UserEntity.createUser(
        complexEmail,
        UsernameVO.fromString('omplexuser'), // Avoid 'c' letter
      );
      await repository.create(userWithComplexEmail);

      // Act
      const foundUser = await repository.findByEmail(complexEmail);

      // Assert
      expect(foundUser).not.toBeNull();
      expect(foundUser?.getEmail().value).toBe('user.name+tag@example.com');
    });
  });

  describe('findById', () => {
    beforeEach(async () => {
      await repository.create(testUser);
    });

    it('should find user by id', async () => {
      // Act
      const foundUser = await repository.findById(testUser.id());

      // Assert
      expect(foundUser).not.toBeNull();
      expect(foundUser?.id().value).toBe(testUser.id().value);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const nonExistentId = UlidVO.create();

      // Act
      const foundUser = await repository.findById(nonExistentId);

      // Assert
      expect(foundUser).toBeNull();
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      // Create multiple users
      const users = [
        UserEntity.createUser(
          EmailVO.fromString('user1@example.com'),
          UsernameVO.fromString('user1'),
        ),
        UserEntity.createUser(
          EmailVO.fromString('user2@example.com'),
          UsernameVO.fromString('user2'),
        ),
        UserEntity.createUser(
          EmailVO.fromString('user3@example.com'),
          UsernameVO.fromString('user3'),
        ),
      ];

      for (const user of users) {
        await repository.create(user);
      }
    });

    it('should return all users with pagination', async () => {
      // Act
      const result = await repository.findAll(1, 2);

      // Assert
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.totalPages).toBe(2);
    });

    it('should return second page', async () => {
      // Act
      const result = await repository.findAll(2, 2);

      // Assert
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(3);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(2);
      expect(result.totalPages).toBe(2);
    });

    it('should return empty result for page beyond total pages', async () => {
      // Act
      const result = await repository.findAll(5, 2);

      // Assert
      expect(result.users).toHaveLength(0);
      expect(result.total).toBe(3);
      expect(result.page).toBe(5);
      expect(result.limit).toBe(2);
      expect(result.totalPages).toBe(2);
    });

    it('should handle single user per page', async () => {
      // Act
      const result = await repository.findAll(1, 1);

      // Assert
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.totalPages).toBe(3);
    });
  });

  describe('findByDateRange', () => {
    let user1: UserEntity;
    let user2: UserEntity;
    let user3: UserEntity;

    beforeEach(async () => {
      // Create users with different creation times
      user1 = UserEntity.createUser(
        EmailVO.fromString('user1@example.com'),
        UsernameVO.fromString('user1'),
      );
      await new Promise((resolve) => setTimeout(resolve, 10));

      user2 = UserEntity.createUser(
        EmailVO.fromString('user2@example.com'),
        UsernameVO.fromString('user2'),
      );
      await new Promise((resolve) => setTimeout(resolve, 10));

      user3 = UserEntity.createUser(
        EmailVO.fromString('user3@example.com'),
        UsernameVO.fromString('user3'),
      );

      await repository.create(user1);
      await repository.create(user2);
      await repository.create(user3);
    });

    it('should find users within date range', async () => {
      // Arrange
      const startDate = TimestampVO.create();
      startDate.value.setTime(user1.createdAt().value.getTime() - 1000);
      const endDate = TimestampVO.create();
      endDate.value.setTime(user3.createdAt().value.getTime() + 1000);

      // Act
      const result = await repository.findByDateRange(
        startDate,
        endDate,
        1,
        10,
      );

      // Assert
      expect(result.users).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('should find users from start date only', async () => {
      // Arrange
      const startDate = user2.createdAt();

      // Act
      const result = await repository.findByDateRange(startDate, null, 1, 10);

      // Assert
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should find users until end date only', async () => {
      // Arrange
      const endDate = user2.createdAt();

      // Act
      const result = await repository.findByDateRange(null, endDate, 1, 10);

      // Assert
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should return empty result when no users in range', async () => {
      // Arrange
      const futureDate = TimestampVO.create();
      futureDate.value.setTime(Date.now() + 86400000); // 1 day in future

      // Act
      const result = await repository.findByDateRange(futureDate, null, 1, 10);

      // Assert
      expect(result.users).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle pagination with date range', async () => {
      // Arrange
      const startDate = TimestampVO.create();
      startDate.value.setTime(user1.createdAt().value.getTime() - 1000);
      const endDate = TimestampVO.create();
      endDate.value.setTime(user3.createdAt().value.getTime() + 1000);

      // Act
      const result = await repository.findByDateRange(startDate, endDate, 1, 2);

      // Assert
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await repository.create(testUser);
    });

    it('should update existing user', async () => {
      // Arrange
      const updatedUser = testUser.updateUser(
        EmailVO.fromString('updated@example.com'),
        UsernameVO.fromString('updateduser'),
      );

      // Act
      await repository.update(updatedUser);

      // Assert
      const foundUser = await repository.findById(testUser.id());
      expect(foundUser).not.toBeNull();
      expect(foundUser?.getEmail().value).toBe('updated@example.com');
      expect(foundUser?.getUsername().value).toBe('updateduser');
    });

    it('should update user with same data', async () => {
      // Act
      await repository.update(testUser);

      // Assert
      const foundUser = await repository.findById(testUser.id());
      expect(foundUser).not.toBeNull();
      expect(foundUser?.getEmail().value).toBe(testUser.getEmail().value);
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      await repository.create(testUser);
    });

    it('should delete existing user', async () => {
      // Act
      await repository.delete(testUser.id());

      // Assert
      const foundUser = await repository.findById(testUser.id());
      expect(foundUser).toBeNull();
    });

    it('should handle deletion of non-existent user', async () => {
      // Arrange
      const nonExistentId = UlidVO.create();

      // Act & Assert
      await expect(repository.delete(nonExistentId)).resolves.not.toThrow();
    });
  });

  describe('interface contract', () => {
    it('should be defined', () => {
      // Assert
      expect(UserRepository).toBeDefined();
      expect(typeof UserRepository).toBe('function');
    });

    it('should be testable through concrete implementation', () => {
      // Assert - The interface contract is verified through the TestUserRepository
      // which implements all required methods and is tested above
      expect(repository).toBeInstanceOf(UserRepository);
      expect(typeof repository.create).toBe('function');
      expect(typeof repository.findByEmail).toBe('function');
      expect(typeof repository.findById).toBe('function');
      expect(typeof repository.findAll).toBe('function');
      expect(typeof repository.findByDateRange).toBe('function');
      expect(typeof repository.update).toBe('function');
      expect(typeof repository.delete).toBe('function');
    });
  });
});
