import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReservedUsernamePipe } from 'src/common/pipes/reserved-username.pipe';
import { CreateNewUserUsecase } from '../../application/usecases/create-new-user.usecase';
import { GetUserByIdUsecase } from '../../application/usecases/get-user-by-id.usecase';
import { GetUsersUsecase } from '../../application/usecases/get-users.usecase';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { GetUsersQueryDto } from '../dto/get-users.query.dto';
import { PaginatedUsersResponseDto } from '../dto/paginated-users.response.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { UserControllerCreateUserSchemas } from '../schemas/user-controller.create-user.schemas';
import { UserControllerGetUserSchemas } from '../schemas/user-controller.get-user.schemas';
import { UserControllerGetUsersSchemas } from '../schemas/user-controller.get-users.schemas';
import { UserControllerMapper } from './mappers/user.controller.mapper';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createNewUserUsecase: CreateNewUserUsecase,
    private readonly getUserByIdUsecase: GetUserByIdUsecase,
    private readonly getUsersUsecase: GetUsersUsecase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UserControllerGetUsersSchemas.getUsersDecorators()
  async getUsers(
    @Query() query: GetUsersQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    const result = await this.getUsersUsecase.execute(query.page, query.limit);
    return UserControllerMapper.toPaginatedResponseDto(result);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UserControllerGetUserSchemas.getUserDecorators()
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserByIdUsecase.execute(id);
    return UserControllerMapper.toResponseDto(user);
  }

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
