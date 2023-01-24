import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../registration/interfaces/registration.interface';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProfileService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async changeEmailSubscriptionStatus(status: boolean, id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, {
      email_subscription: status,
    });

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changeControlAnswer(dto, id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, {
      securityQuestion: dto.securityQuestion,
      ownSecurityQuestion: dto.ownSecurityQuestion,
      securityAnswer: dto.securityAnswer,
    });

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changeEmail(newEmail: string, id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, {
      email: newEmail,
    });

    if (!user) {
      throw new HttpException(
        'User with this ID does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async receiveClientInfo(id: string) {
    const user = await this.userModel.findById(id);
    if (typeof id != 'string') {
      throw new HttpException('This ID is not correct', HttpStatus.BAD_REQUEST);
    }
    if (!user) {
      throw new HttpException(
        'User with this ID does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
    };
  }

  async changePassword(dto, id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(dto.newPassword, 5);
    await this.userModel.findByIdAndUpdate(id, {
      password: hashPassword,
    });
  }
}
