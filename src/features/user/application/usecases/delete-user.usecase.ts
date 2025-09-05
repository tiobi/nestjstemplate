import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserValidationService } from '../services/user-validation.service';

@Injectable()
export class DeleteUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidationService: UserValidationService,
  ) {}

  async execute(id: string): Promise<void> {
    // Validate ID and ensure user exists
    const ulidVO =
      await this.userValidationService.validateIdAndEnsureUserExists(id);

    // Perform soft delete
    await this.userRepository.delete(ulidVO);
  }
}
