import { Injectable } from '@nestjs/common';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UsernameVO } from '../../domain/value_objects/username.vo';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

@Injectable()
export class UpdateUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, username: string): Promise<UserEntity> {
    const userId = UlidVO.fromString(id);
    const usernameValueObject = UsernameVO.create(username);

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new UserNotFoundException(id);
    }

    const updatedUser = existingUser.updateUser(undefined, usernameValueObject);

    await this.userRepository.update(updatedUser);

    return updatedUser;
  }
}
