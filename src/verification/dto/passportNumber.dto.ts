import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { regExpObject } from '../../common/patterns/validationRegExp';

export class PassportNumberDto {
  @ApiProperty({
    example: '4987623A978GH0',
    description: 'Passport Number',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(regExpObject.regExpPassportNumber)
  readonly passportNumber: string;
}
