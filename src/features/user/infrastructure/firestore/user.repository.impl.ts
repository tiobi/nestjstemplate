import { Injectable } from '@nestjs/common';
import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserNotFoundException } from '../../application/exceptions/user-not-found.exception';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../domain/value_objects/email.vo';
import { UsernameVO } from '../../domain/value_objects/username.vo';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  // Mock data store for demonstration
  private mockUsers: Map<string, UserEntity> = new Map();

  async create(user: UserEntity): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.mockUsers.set(user.id().value, user);
    return;
  }

  async findByEmail(email: EmailVO): Promise<UserEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Check mock users first
    for (const user of this.mockUsers.values()) {
      if (!user.deletedAt() && user.getEmail().value === email.value) {
        return user;
      }
    }

    // Fallback to predefined test emails
    const emailList = [
      'test@test.com',
      'test2@test.com',
      'test3@test.com',
      'test4@test.com',
      'test5@test.com',
      'test@example.com',
    ];

    if (emailList.includes(email.value)) {
      return UserEntity.createUser(email, UsernameVO.create('test'));
    }

    return null;
  }

  async findById(id: UlidVO): Promise<UserEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const user = this.mockUsers.get(id.value);
    if (user && !user.deletedAt()) {
      return user;
    }

    return null;
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
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Filter out soft-deleted users
    const activeUsers = Array.from(this.mockUsers.values()).filter(
      (user) => !user.deletedAt(),
    );

    const total = activeUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const users = activeUsers.slice(startIndex, endIndex);

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
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Filter out soft-deleted users first
    const activeUsers = Array.from(this.mockUsers.values()).filter(
      (user) => !user.deletedAt(),
    );

    // Filter by date range
    const filteredUsers = activeUsers.filter((user) => {
      const userCreatedAt = user.createdAt();

      // If no start date provided, include all users before end date
      if (startDate === null && endDate !== null) {
        return userCreatedAt.value <= endDate.value;
      }

      // If no end date provided, include all users after start date
      if (startDate !== null && endDate === null) {
        return userCreatedAt.value >= startDate.value;
      }

      // If both dates provided, include users within range
      if (startDate !== null && endDate !== null) {
        return (
          userCreatedAt.value >= startDate.value &&
          userCreatedAt.value <= endDate.value
        );
      }

      // If no dates provided, return all users (same as findAll)
      return true;
    });

    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const users = filteredUsers.slice(startIndex, endIndex);

    return {
      users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async update(user: UserEntity): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const existingUser = this.mockUsers.get(user.id().value);
    if (!existingUser || existingUser.deletedAt()) {
      throw new UserNotFoundException(user.id().value);
    }

    this.mockUsers.set(user.id().value, user);
  }

  async delete(id: UlidVO): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const user = this.mockUsers.get(id.value);
    if (!user || user.deletedAt()) {
      throw new UserNotFoundException(id.value);
    }

    // Perform soft delete
    const deletedUser = user.delete() as UserEntity;
    this.mockUsers.set(id.value, deletedUser);
  }
}
