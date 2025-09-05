import { Injectable } from '@nestjs/common';
import { TimestampVO } from 'src/common/value_objects/timestamp.vo';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserValidationService } from '../services/user-validation.service';

export interface GetUsersByDateRangeResult {
  users: UserEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class GetUsersByDateRangeUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidationService: UserValidationService,
  ) {}

  async execute(
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetUsersByDateRangeResult> {
    // Validate pagination parameters
    const { validPage, validLimit } =
      this.userValidationService.validatePagination(page, limit);

    // Parse dates if provided
    const startTimestamp = startDate ? TimestampVO.fromString(startDate) : null;
    const endTimestamp = endDate ? TimestampVO.fromString(endDate) : null;

    // Validate date range if both dates are provided
    if (
      startTimestamp &&
      endTimestamp &&
      startTimestamp.value > endTimestamp.value
    ) {
      throw new Error('Start date must be before or equal to end date');
    }

    // Get paginated users from repository
    const result = await this.userRepository.findByDateRange(
      startTimestamp,
      endTimestamp,
      validPage,
      validLimit,
    );

    return {
      users: result.users,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
