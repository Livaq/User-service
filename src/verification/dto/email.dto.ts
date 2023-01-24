import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({
    example: 'email@email.com',
    description: 'email',
  })
  readonly email: string;
}
