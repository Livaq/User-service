import { ApiProperty } from '@nestjs/swagger';
import {
  Contains,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { regExpObject } from '../../common/patterns/validationRegExp';

export class VerificationDto {
  @ApiProperty({
    example: 'email@email.com',
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 320, { message: 'Your emails length must be from 3 to 320' })
  @Contains('@')
  @IsString()
  @Matches(regExpObject.regExpEmail)
  readonly receiver: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP for verification',
  })
  @IsNotEmpty()
  @IsString()
  readonly verificationCode?: string;
}
