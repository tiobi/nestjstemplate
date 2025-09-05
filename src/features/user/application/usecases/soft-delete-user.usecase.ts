import { Injectable } from '@nestjs/common';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

@Injectable()
export class SoftDeleteUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    // Validate and create ULID value object
    let userUlid: UlidVO;
    try {
      userUlid = UlidVO.fromString(userId);
    } catch {
      throw new UserNotFoundException(userId);
    }

    const user = await this.userRepository.findById(userUlid);

    if (!user || user.deletedAt() !== null) {
      throw new UserNotFoundException(userId);
    }

    const softDeletedUser = user.softDelete();
    await this.userRepository.update(softDeletedUser);
  }
}
