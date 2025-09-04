import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '01HXYZ123456789ABCDEFGHIJK',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Username for the user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2024-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2024-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Timestamp when the user was soft deleted',
    example: null,
    format: 'date-time',
  })
  deletedAt: string | null;
}
