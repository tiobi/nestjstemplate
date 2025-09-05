import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Username for the user',
    example: 'johndoe',
    minLength: 3,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  username?: string;
}
