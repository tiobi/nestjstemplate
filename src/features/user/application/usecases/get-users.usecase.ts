import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

export interface GetUsersResult {
  users: UserEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class GetUsersUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(page: number = 1, limit: number = 10): Promise<GetUsersResult> {
    // Ensure valid pagination values
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100);

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
