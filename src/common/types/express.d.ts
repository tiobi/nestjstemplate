import { UserEntity } from '../../features/user/domain/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
