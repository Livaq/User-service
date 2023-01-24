import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationModule } from './registration/registration.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { VerificationModule } from './verification/verification.module';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    RegistrationModule,
    AuthenticationModule,
    VerificationModule,
    MailModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
