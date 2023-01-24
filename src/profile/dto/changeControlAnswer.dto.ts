import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { regExpObject } from '../../common/patterns/validationRegExp';

export class ChangeControlAnswerDto {
  @ApiProperty({
    example: 'Question?',
    description: 'Security question',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpSecurityQuestion)
  readonly securityQuestion: string;

  @ApiProperty({
    example: 'Question?',
    description: 'Own Security question',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpSecurityQuestion)
  readonly ownSecurityQuestion: string | null;

  @ApiProperty({
    example: 'Answer.',
    description: 'Security answer',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpSecurityQuestion)
  readonly securityAnswer: string;
}
