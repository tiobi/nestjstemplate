import { Injectable, NotFoundException } from '@nestjs/common';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class SoftDeleteUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    const userUlid = UlidVO.fromString(userId);
    const user = await this.userRepository.findById(userUlid);

    if (!user || user.deletedAt() !== null) {
      throw new NotFoundException('User not found');
    }

    const softDeletedUser = user.softDelete();
    await this.userRepository.update(softDeletedUser);
  }
}
