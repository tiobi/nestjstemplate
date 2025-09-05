import { Injectable } from '@nestjs/common';
import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

@Injectable()
export class UserValidationService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Validates and creates a ULID value object from string
   * @param id - The ID string to validate
   * @returns UlidVO instance
   * @throws UserNotFoundException if ID is invalid
   */
  validateAndCreateUlid(id: string): UlidVO {
    try {
      return UlidVO.fromString(id);
    } catch {
      throw new UserNotFoundException(id);
    }
  }

  /**
   * Validates pagination parameters
   * @param page - Page number
   * @param limit - Items per page
   * @returns Validated pagination parameters
   */
  validatePagination(
    page: number = 1,
    limit: number = 10,
  ): {
    validPage: number;
    validLimit: number;
  } {
    return {
      validPage: Math.max(1, page),
      validLimit: Math.min(Math.max(1, limit), 100),
    };
  }

  /**
   * Ensures user exists and is not soft deleted
   * @param ulid - User ULID
   * @returns UserEntity if found and active
   * @throws UserNotFoundException if user not found or soft deleted
   */
  async ensureUserExists(ulid: UlidVO): Promise<void> {
    const user = await this.userRepository.findById(ulid);
    if (!user || user.deletedAt() !== null) {
      throw new UserNotFoundException(ulid.value);
    }
  }

  /**
   * Validates ID and ensures user exists
   * @param id - User ID string
   * @returns UlidVO if valid and user exists
   * @throws UserNotFoundException if invalid ID or user not found
   */
  async validateIdAndEnsureUserExists(id: string): Promise<UlidVO> {
    const ulid = this.validateAndCreateUlid(id);
    await this.ensureUserExists(ulid);
    return ulid;
  }
}
