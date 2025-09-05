import { Injectable } from '@nestjs/common';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../domain/value_objects/email.vo';
import { UsernameVO } from '../../domain/value_objects/username.vo';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

export interface UpdateUserData {
  email?: string;
  username?: string;
}

@Injectable()
export class UpdateUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, updateData: UpdateUserData): Promise<UserEntity> {
    // Validate and create ULID value object
    let ulidVO: UlidVO;
    try {
      ulidVO = UlidVO.fromString(id);
    } catch {
      throw new UserNotFoundException(id);
    }

    // Find existing user
    const existingUser = await this.userRepository.findById(ulidVO);
    if (!existingUser) {
      throw new UserNotFoundException(id);
    }

    // Prepare value objects for update
    let emailVO: EmailVO | undefined;
    let usernameVO: UsernameVO | undefined;

    // Validate and create email value object if provided
    if (updateData.email !== undefined) {
      emailVO = EmailVO.create(updateData.email);

      // Check if email is already taken by another user
      const userWithEmail = await this.userRepository.findByEmail(emailVO);
      if (
        userWithEmail &&
        userWithEmail.id().value !== existingUser.id().value
      ) {
        throw new EmailAlreadyExistsException(emailVO.value);
      }
    }

    // Validate and create username value object if provided
    if (updateData.username !== undefined) {
      usernameVO = UsernameVO.create(updateData.username);
    }

    // Update user entity
    const updatedUser = existingUser.updateUser(emailVO, usernameVO);

    // Save updated user
    await this.userRepository.update(updatedUser);

    return updatedUser;
  }
}
