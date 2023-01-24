import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateUserDto {
  @ApiProperty({
    example: 'email@email.com / AAA333',
    description: 'Email or passport number as login',
  })
  @IsNotEmpty()
  @IsString()
  readonly login: string;

  @ApiProperty({ example: 'qwerty123', description: 'Users password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: 'EMAIL/PASSPORT_NUMBER',
    description: 'Type of login',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: string;
}
