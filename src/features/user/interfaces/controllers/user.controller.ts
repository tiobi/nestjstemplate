import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReservedUsernamePipe } from 'src/common/pipes/reserved-username.pipe';
import { CreateNewUserUsecase } from '../../application/usecases/create-new-user.usecase';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { UserControllerCreateUserSchemas } from '../schemas/user-controller.create-user.schemas';
import { UserControllerMapper } from './mappers/user.controller.mapper';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly createNewUserUsecase: CreateNewUserUsecase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ReservedUsernamePipe)
  @UserControllerCreateUserSchemas.createUserDecorators()
  async createUser(
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.createNewUserUsecase.execute(
      createUserRequestDto.email,
      createUserRequestDto.username ?? null,
    );

    return UserControllerMapper.toResponseDto(user);
  }
}
