import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: '',
    description: 'Password',
  })
  readonly password: string;

  @ApiProperty({
    example: '',
    description: 'New Password',
  })
  readonly newPassword: string;
}
