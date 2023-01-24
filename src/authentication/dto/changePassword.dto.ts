import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { regExpObject } from '../../common/patterns/validationRegExp';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'WfjsET1234',
    description: 'password',
  })
  @IsNotEmpty()
  @Length(6, 20)
  @IsString()
  @Matches(regExpObject.regExpPassword)
  readonly newPassword: string;
}
