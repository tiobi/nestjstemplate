import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserRequestDto {
  @ApiProperty({
    description: 'New username for the user',
    example: 'newusername',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  username: string;
}
