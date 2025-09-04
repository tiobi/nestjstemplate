import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(3, 20)
  username?: string;
}
