import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { Injectable } from '@nestjs/common';
import { EmailVO } from '../../domain/value_objects/email.vo';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  async create(user: UserEntity): Promise<void> {
    user.id();
    await new Promise((resolve) => setTimeout(resolve, 10));

    return;
  }

  async findByEmail(email: EmailVO): Promise<UserEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const emailList = [
      'test@test.com',
      'test2@test.com',
      'test3@test.com',
      'test4@test.com',
      'test5@test.com',
      'test@example.com',
    ];

    if (emailList.includes(email.value)) {
      return UserEntity.createUser(email);
    }

    return null;
  }
}
