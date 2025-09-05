import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({
    description: 'Confirmation message',
    example: 'User successfully deleted',
  })
  message: string;

  @ApiProperty({
    description: 'ID of the deleted user',
    example: '01K49Y9P75B9NB6W15VZ37YV6B',
  })
  userId: string;
}
