import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetadataDto } from 'src/common/schemas';
import { UserResponseDto } from './user.response.dto';

export class PaginatedUsersResponseDto {
  @ApiProperty({
    description: 'Array of users',
    type: [UserResponseDto],
  })
  @Type(() => UserResponseDto)
  users: UserResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetadataDto,
  })
  pagination: PaginationMetadataDto;
}
