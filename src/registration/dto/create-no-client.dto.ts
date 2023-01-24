import { ApiProperty } from '@nestjs/swagger';
import {
  Contains,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsBoolean,
  IsDate,
  IsEnum,
} from 'class-validator';
import { regExpObject } from '../../common/patterns/validationRegExp';
import { ClientStatusEnum } from '../enums/clientStatus.enum';

export class CreateNoClientDto {
  @ApiProperty({ example: 'email@email.com', description: 'Users Email' })
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 320, { message: 'Your emails length must be from 3 to 320' })
  @Contains('@')
  @IsString()
  @Matches(regExpObject.regExpEmail)
  readonly email: string;

  @ApiProperty({ example: 'qwerty123', description: 'Users password' })
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

  @ApiProperty({ example: 'Answer', description: 'Security answer' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpSecurityAnswer)
  readonly securityAnswer: string;

  @ApiProperty({ example: 'Sergey', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpName)
  readonly firstName: string;

  @ApiProperty({ example: 'Vladimirovich', description: 'Middle name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpName)
  readonly middleName: string | null;

  @ApiProperty({ example: 'Romanov', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(regExpObject.regExpName)
  readonly lastName: string;

  @ApiProperty({ example: 'AAA333', description: 'Users passport number' })
  @IsString()
  @IsNotEmpty()
  @Matches(regExpObject.regExpPassportNumber)
  readonly passportNumber: string;

  @ApiProperty({ example: true, description: 'Resident status' })
  @IsBoolean()
  @IsNotEmpty()
  readonly isResident: boolean;

  @ApiProperty({ example: '1987-09-28', description: 'Date of registration' })
  readonly appRegistrationDate: Date;

  @ApiProperty({ example: '1987-09-28', description: 'Date of accession' })
  readonly accessionDate: Date;

  @ApiProperty({
    example: 'REGISTERED_CLIENT_NOT_ACTIVE',
    description: 'Status of the Client',
  })
  @IsNotEmpty()
  @IsEnum(ClientStatusEnum)
  readonly clientStatus: string;
}
