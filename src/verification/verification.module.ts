import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { VerificationSchema } from '../common/schemas/verification.schema';
import { UserSchema } from '../common/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Verification', schema: VerificationSchema },
      { name: 'User', schema: UserSchema },
    ]),
    MailModule,
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
