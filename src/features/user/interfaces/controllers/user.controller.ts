import {
  Body,
  Controller,
  Delete,
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
import { GetUsersByDateRangeUsecase } from '../../application/usecases/get-users-by-date-range.usecase';
import { GetUsersUsecase } from '../../application/usecases/get-users.usecase';
import { SoftDeleteUserUsecase } from '../../application/usecases/soft-delete-user.usecase';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { DeleteUserResponseDto } from '../dto/delete-user.response.dto';
import { GetUsersByDateRangeQueryDto } from '../dto/get-users-by-date-range.query.dto';
import { GetUsersQueryDto } from '../dto/get-users.query.dto';
import { PaginatedUsersResponseDto } from '../dto/paginated-users.response.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { UserControllerCreateUserSchemas } from '../schemas/user-controller.create-user.schemas';
import { UserControllerDeleteUserSchemas } from '../schemas/user-controller.delete-user.schemas';
import { UserControllerGetUserSchemas } from '../schemas/user-controller.get-user.schemas';
import { UserControllerGetUsersByDateRangeSchemas } from '../schemas/user-controller.get-users-by-date-range.schemas';
import { UserControllerGetUsersSchemas } from '../schemas/user-controller.get-users.schemas';
import { UserControllerMapper } from './mappers/user.controller.mapper';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createNewUserUsecase: CreateNewUserUsecase,
    private readonly getUserByIdUsecase: GetUserByIdUsecase,
    private readonly getUsersUsecase: GetUsersUsecase,
    private readonly getUsersByDateRangeUsecase: GetUsersByDateRangeUsecase,
    private readonly softDeleteUserUsecase: SoftDeleteUserUsecase,
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

  @Get('by-date-range')
  @HttpCode(HttpStatus.OK)
  @UserControllerGetUsersByDateRangeSchemas.getUsersByDateRangeDecorators()
  async getUsersByDateRange(
    @Query() query: GetUsersByDateRangeQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    const result = await this.getUsersByDateRangeUsecase.execute(
      query.startDate,
      query.endDate,
      query.page,
      query.limit,
    );
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

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UserControllerDeleteUserSchemas.deleteUserDecorators()
  async deleteUser(@Param('id') id: string): Promise<DeleteUserResponseDto> {
    await this.softDeleteUserUsecase.execute(id);
    return UserControllerMapper.toDeleteResponseDto(
      id,
    ) as DeleteUserResponseDto;
  }
}
