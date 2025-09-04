import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { EmailVO } from '../../domain/value_objects/email.vo';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';

@Injectable()
export class CreateNewUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<UserEntity> {
    const emailValueObject = EmailVO.create(email);

    const existingUser =
      await this.userRepository.findByEmail(emailValueObject);
    if (existingUser) {
      throw new EmailAlreadyExistsException(emailValueObject.value);
    }

    const user = UserEntity.createUser(emailValueObject);

    // save user

    await new Promise((resolve) => setTimeout(resolve, 10));

    return user;
  }
}
