import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../common/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './tokenStrategies/accessToken.strategy';
import { RefreshTokenStrategy } from './tokenStrategies/refreshToken.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({}),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    ConfigService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthenticationModule {}
