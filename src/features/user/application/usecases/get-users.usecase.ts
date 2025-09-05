import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserValidationService } from '../services/user-validation.service';

export interface GetUsersResult {
  users: UserEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class GetUsersUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidationService: UserValidationService,
  ) {}

  async execute(page: number = 1, limit: number = 10): Promise<GetUsersResult> {
    // Validate pagination parameters
    const { validPage, validLimit } =
      this.userValidationService.validatePagination(page, limit);

    // Get paginated users from repository
    const result = await this.userRepository.findAll(validPage, validLimit);

    return {
      users: result.users,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
