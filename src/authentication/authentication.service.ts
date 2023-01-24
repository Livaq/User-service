import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../registration/interfaces/registration.interface';
import { LoginType } from './interfaces/loginType.enum';
import { ValidateUserDto } from './dto/validateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { mongooseId } from '../common/interfaces/id.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(validateInfo: ValidateUserDto) {
    let user;
    let passwordMatches;

    if (validateInfo.type === LoginType.passportNumber) {
      user = await this.userModel.findOne({
        passportNumber: validateInfo.login,
      });
    }

    if (validateInfo.type === LoginType.email) {
      user = await this.userModel.findOne({
        email: validateInfo.login,
      });
    }

    if (!user || !user.password) {
      throw new HttpException('Incorrect input', HttpStatus.BAD_REQUEST);
    }

    if (user) {
      passwordMatches = await bcrypt.compare(
        validateInfo.password,
        user.password,
      );
    }

    if (!passwordMatches) {
      throw new HttpException('Incorrect input', HttpStatus.BAD_REQUEST);
    }

    const tokens = await this.generateTokens(user._id);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(id: mongooseId, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 5);
    await this.update(id, { refreshToken: hashedRefreshToken });
  }

  async update(id: mongooseId, updateDto: IUser): Promise<any> {
    return this.userModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async refreshTokens(id: string, refreshToken: string) {
    const user = await this.userModel.findById(id);
    if (!user || !user.refreshToken) {
      throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.generateTokens(user._id);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async generateTokens(id: mongooseId) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '10m',
        },
      ),
      this.jwtService.signAsync(
        { id },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '30m',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async changePassword(newPassword: string, userEmail: string) {
    if (!userEmail) {
      throw new HttpException(
        'This email is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    await this.userModel.findOneAndUpdate(
      { email: userEmail },
      { password: hashedPassword },
    );
  }
}
