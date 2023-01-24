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

export class GetClientStatusDto {
  @ApiProperty({ example: 'email@email.com', description: 'Users Email' })
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 320, { message: 'Your emails length must be from 3 to 320' })
  @Contains('@')
  @IsString()
  @Matches(regExpObject.regExpEmail)
  readonly email: string;
}
