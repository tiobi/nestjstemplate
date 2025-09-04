import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  // UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateNewUserUsecase } from '../../application/usecases/create-new-user.usecase';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { UserControllerMapper } from './mappers/user.controller.mapper';
// import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ReservedUsernamePipe } from 'src/common/pipes/reserved-username.pipe';
import { UserControllerCreateUserSchemas } from '../schemas/user-controller.create-user.schemas';

@ApiTags('Users')
@Controller('users')
// @UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly createNewUserUsecase: CreateNewUserUsecase) {}

  @Post()
  // @UseGuards(AdminRoleGuard)
  // @ApiBearerAuth('JWT-auth')
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
