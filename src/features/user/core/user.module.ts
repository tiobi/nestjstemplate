import { Module } from '@nestjs/common';
import { CreateNewUserUsecase } from '../application/usecases/create-new-user.usecase';
import { GetUserByIdUsecase } from '../application/usecases/get-user-by-id.usecase';
import { GetUsersByDateRangeUsecase } from '../application/usecases/get-users-by-date-range.usecase';
import { GetUsersUsecase } from '../application/usecases/get-users.usecase';
import { SoftDeleteUserUsecase } from '../application/usecases/soft-delete-user.usecase';
import { UpdateUserUsecase } from '../application/usecases/update-user.usecase';
import { UserRepository } from '../domain/repositories/user.repository.interface';
import { UserRepositoryImpl } from '../infrastructure/firestore/user.repository.impl';
import { UserController } from '../interfaces/controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    { provide: UserRepository, useClass: UserRepositoryImpl },
    CreateNewUserUsecase,
    GetUserByIdUsecase,
    GetUsersUsecase,
    GetUsersByDateRangeUsecase,
    SoftDeleteUserUsecase,
    UpdateUserUsecase,
  ],
  exports: [UserRepository],
})
export class UserModule {}
