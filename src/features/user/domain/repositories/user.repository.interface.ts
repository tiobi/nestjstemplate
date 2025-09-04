import { UlidVO } from 'src/common/value_objects/ulid.vo';
import { UserEntity } from '../entities/user.entity';
import { EmailVO } from '../value_objects/email.vo';

export abstract class UserRepository {
  abstract create(user: UserEntity): Promise<void>;
  abstract findByEmail(email: EmailVO): Promise<UserEntity | null>;
  abstract findById(id: UlidVO): Promise<UserEntity | null>;
  abstract findAll(
    page: number,
    limit: number,
  ): Promise<{
    users: UserEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  abstract update(user: UserEntity): Promise<void>;
  abstract delete(id: UlidVO): Promise<void>;
}
