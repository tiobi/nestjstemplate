import { Injectable } from '@nestjs/common';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

@Injectable()
export class DeleteUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    // Validate and create ULID value object
    let ulidVO: UlidVO;
    try {
      ulidVO = UlidVO.fromString(id);
    } catch {
      throw new UserNotFoundException(id);
    }

    // Check if user exists before attempting to delete
    const existingUser = await this.userRepository.findById(ulidVO);
    if (!existingUser) {
      throw new UserNotFoundException(id);
    }

    // Perform soft delete
    await this.userRepository.delete(ulidVO);
  }
}
