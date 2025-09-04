import { UserEntity } from '../entities/user.entity';
import { EmailVO } from '../value_objects/email.vo';

export abstract class UserRepository {
  abstract create(user: UserEntity): Promise<void>;
  abstract findByEmail(email: EmailVO): Promise<UserEntity | null>;
}
