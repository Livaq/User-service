import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type VerificationDocument = HydratedDocument<Verification>;

@Schema()
export class Verification {
  @ApiProperty({ example: 'email@email.com', description: 'Email' })
  @Prop()
  email: string;

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
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
