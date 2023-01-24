import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Contains,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { regExpObject } from '../../common/patterns/validationRegExp';

export class CreateClientDto {
  @ApiProperty({ example: 'email@email.com', description: 'Users Email' })
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 320, { message: 'Your emails length must be from 3 to 320' })
  @Contains('@')
  @IsString()
  @Matches(regExpObject.regExpEmail)
  readonly email: string;

  @ApiProperty({ example: 'qwerty123', description: 'Users password' })
  //@IsStrongPassword() //Doesn't exist in class-validator
  @IsNotEmpty()
  @Length(6, 20)
  @IsString()
  @Matches(regExpObject.regExpPassword)
  readonly password: string;

  @ApiProperty({ example: 'Question?', description: 'Security question' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpSecurityQuestion)
  readonly securityQuestion: string;

  @ApiProperty({
    example: 'Question?',
    description: 'Custom Security question',
  })
  @IsOptional() //Check string or null
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpSecurityQuestion)
  readonly ownSecurityQuestion?: string | null;

  @ApiProperty({ example: 'Answer.', description: 'Security answer' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpSecurityAnswer)
  readonly securityAnswer: string;
}
