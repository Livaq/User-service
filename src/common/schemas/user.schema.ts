import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({ example: 'email@email.com', description: 'Email' })
  @Prop()
  email: string;

  @ApiProperty({ example: 'qwerty123', description: 'Password' })
  @Prop()
  password: string;

  @ApiProperty({ example: 'Sergey', description: 'First name' })
  @Prop()
  readonly firstName: string;

  @ApiProperty({ example: 'Vladimirovich', description: 'Middle name' })
  @Prop()
  readonly middleName: string;

  @ApiProperty({ example: 'Romanov', description: 'Last name' })
  @Prop()
  readonly lastName: string;

  @ApiProperty({ example: 'AAA333', description: 'Passport number' })
  @Prop()
  passportNumber: string;

  @ApiProperty({ example: true, description: 'Resident status' })
  readonly isResident: boolean;

  @ApiProperty({ example: 'Question?', description: 'Security question' })
  @Prop()
  securityQuestion: string;

  @ApiProperty({
    example: 'Question?',
    description: 'Custom Security question',
  })
  @Prop()
  ownSecurityQuestion: string | null;

  @ApiProperty({ example: 'Answer.', description: 'Security answer' })
  @Prop()
  securityAnswer: string;

  @ApiProperty({ example: '123456.', description: 'Verification Code' })
  @Prop()
  verification_code: string;

  @ApiProperty({ example: '3', description: 'Attempts left to enter the OTP' })
  @Prop()
  attemptsLeft: number;

  @ApiProperty({
    example: '2022-12-12T14:52:41.812+00:00',
    description: 'Date of user block expiration',
  })
  @Prop()
  user_block_expiration: Date;

  @ApiProperty({
    example: '2022-12-12T14:52:41.812+00:00',
    description: 'Expiration date of verification code',
  })
  @Prop()
  code_expiration: Date;

  @ApiProperty({ example: '1987-09-28', description: 'Date of registration' })
  @Prop()
  readonly appRegistrationDate: Date;

  @ApiProperty({ example: '1987-09-28', description: 'Date of accession' })
  @Prop()
  readonly accessionDate: Date;

  @ApiProperty({
    example: 'NOT_CLIENT_REGISTERED',
    description: 'Status of the Client',
  })
  @Prop()
  readonly clientStatus: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9',
    description: 'Refresh token',
  })
  @Prop()
  refreshToken: string;

  @ApiProperty({
    example: 'true',
    description: 'Email notification status',
  })
  @Prop()
  email_subscription: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
