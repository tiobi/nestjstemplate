import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserRequestDto } from 'src/features/user/interfaces/dto/create-user.request.dto';

@Injectable()
export class ReservedUsernamePipe implements PipeTransform {
  private readonly reservedUsernamePool = [
    'admin',
    'superadmin',
    'root',
    'system',
    'administrator',
    'moderator',
  ];

  private readonly USERNAME_CONTAINS_RESERVED_WORDS_ERROR_MESSAGE =
    'Username contains reserved words';

  transform(value: CreateUserRequestDto): CreateUserRequestDto {
    const username = value.username?.toLowerCase() ?? '';

    // Check for exact matches
    if (this.reservedUsernamePool.includes(username)) {
      throw new BadRequestException(
        this.USERNAME_CONTAINS_RESERVED_WORDS_ERROR_MESSAGE,
      );
    }

    // Check for usernames containing reserved words
    const containsReservedWord = this.reservedUsernamePool.some((reserved) =>
      username.includes(reserved.toLowerCase()),
    );

    if (containsReservedWord) {
      throw new BadRequestException(
        this.USERNAME_CONTAINS_RESERVED_WORDS_ERROR_MESSAGE,
      );
    }

    return value;
  }
}
