import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserValidationService } from '../services/user-validation.service';

@Injectable()
export class SoftDeleteUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidationService: UserValidationService,
  ) {}

  async execute(userId: string): Promise<void> {
    // Validate ID and ensure user exists
    const userUlid =
      await this.userValidationService.validateIdAndEnsureUserExists(userId);

    const user = await this.userRepository.findById(userUlid);
    const softDeletedUser = user!.softDelete();
    await this.userRepository.update(softDeletedUser);
  }
}
