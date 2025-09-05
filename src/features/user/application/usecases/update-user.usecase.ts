import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UsernameVO } from '../../domain/value_objects/username.vo';
import { UserValidationService } from '../services/user-validation.service';

@Injectable()
export class UpdateUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidationService: UserValidationService,
  ) {}

  async execute(id: string, username: string): Promise<UserEntity> {
    // Validate ID and ensure user exists
    const userId =
      await this.userValidationService.validateIdAndEnsureUserExists(id);
    const usernameValueObject = UsernameVO.create(username);

    const existingUser = await this.userRepository.findById(userId);
    const updatedUser = existingUser!.updateUser(
      undefined,
      usernameValueObject,
    );

    await this.userRepository.update(updatedUser);

    return updatedUser;
  }
}
