import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../infrastructure/firestore/user.repository.impl';
import { UserRepository } from '../domain/repositories/user.repository.interface';
import { UserController } from '../interfaces/controllers/user.controller';
import { CreateNewUserUsecase } from '../application/usecases/create-new-user.usecase';

@Module({
  controllers: [UserController],
  providers: [
    { provide: UserRepository, useClass: UserRepositoryImpl },
    CreateNewUserUsecase,
  ],
  exports: [UserRepository],
})
export class UserModule {}
