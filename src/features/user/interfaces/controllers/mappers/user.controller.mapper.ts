import { UserEntity } from 'src/features/user/domain/entities/user.entity';
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
}
