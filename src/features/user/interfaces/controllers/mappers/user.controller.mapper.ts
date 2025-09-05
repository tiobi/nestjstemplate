import { GetUsersResult } from 'src/features/user/application/usecases/get-users.usecase';
import { UserEntity } from 'src/features/user/domain/entities/user.entity';
import { PaginatedUsersResponseDto } from '../../dto/paginated-users.response.dto';
import { UserResponseDto } from '../../dto/user.response.dto';

export class UserControllerMapper {
  static toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id().value,
      email: user.getEmail().value,
      username: user.getUsername().value,
      createdAt: user.createdAt().toJsonFormat(),
      updatedAt: user.updatedAt().toJsonFormat(),
      deletedAt: user.deletedAt()?.toJsonFormat() ?? null,
    };
  }

  static toPaginatedResponseDto(
    result: GetUsersResult,
  ): PaginatedUsersResponseDto {
    const users = result.users.map((user: UserEntity) =>
      this.toResponseDto(user),
    );
    const total = result.total;
    const page = result.page;
    const limit = result.limit;
    const totalPages = result.totalPages;

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
