import { ApiProperty } from '@nestjs/swagger';

export class ClientStatusDto {
  @ApiProperty({ example: 'email@email.com', description: 'email' })
  readonly email: string;

  @ApiProperty({
    example: 'NOT_REGISTERED_NOT_CLIENT',
    description: 'User status',
  })
  readonly clientStatus: string;
}
