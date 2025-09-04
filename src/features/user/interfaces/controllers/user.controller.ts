import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  // UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { CreateNewUserUsecase } from '../../application/usecases/create-new-user.usecase';
import { UserResponseDto } from '../dto/user.response.dto';
import { UserControllerMapper } from './mappers/user.controller.mapper';
// import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import { ReservedUsernamePipe } from 'src/common/pipes/reserved-username.pipe';

@Controller('users')
// @UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly createNewUserUsecase: CreateNewUserUsecase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(AdminRoleGuard)
  @UsePipes(ReservedUsernamePipe)
  async createUser(
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.createNewUserUsecase.execute(
      createUserRequestDto.email,
    );

    return UserControllerMapper.toResponseDto(user);
  }
}
