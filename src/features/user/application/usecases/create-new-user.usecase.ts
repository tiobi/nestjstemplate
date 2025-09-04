import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { EmailVO } from '../../domain/value_objects/email.vo';
import { UsernameVO } from '../../domain/value_objects/username.vo';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';

@Injectable()
export class CreateNewUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, username: string | null): Promise<UserEntity> {
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const emailValueObject = EmailVO.create(email);

    const existingUser =
      await this.userRepository.findByEmail(emailValueObject);
    if (existingUser) {
      throw new EmailAlreadyExistsException(emailValueObject.value);
    }

    const usernameValueObject = UsernameVO.create(username);

    const user = UserEntity.createUser(emailValueObject, usernameValueObject);

    // save user

    await new Promise((resolve) => setTimeout(resolve, 10));

    return user;
  }
}
