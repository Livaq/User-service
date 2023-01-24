import {
  Contains,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { regExpObject } from '../../common/patterns/validationRegExp';
import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationCodeDto {
  @ApiProperty({
    example: '123056',
    description: 'Verification code which was sent at email',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(regExpObject.regExpVerificationCode)
  readonly verificationCode: string;

  @ApiProperty({ example: 'email@email.com', description: 'Users Email' })
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 320, { message: 'Your emails length must be from 3 to 320' })
  @Contains('@')
  @IsString()
  @Matches(regExpObject.regExpEmail)
  readonly email: string;
}
