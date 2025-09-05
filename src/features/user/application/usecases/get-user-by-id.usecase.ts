import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserValidationService } from '../services/user-validation.service';

@Injectable()
export class GetUserByIdUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidationService: UserValidationService,
  ) {}

  async execute(id: string): Promise<UserEntity> {
    // Validate ID and ensure user exists
    const ulidVO =
      await this.userValidationService.validateIdAndEnsureUserExists(id);

    // Find user by ID
    const user = await this.userRepository.findById(ulidVO);

    return user!; // We know user exists due to validation
  }
}
