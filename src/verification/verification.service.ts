import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../registration/interfaces/registration.interface';
import { MailService } from '../mail/mail.service';
import { verificationOptions } from '../common/config/verification-options.config';
import { IVerification } from './interfaces/verification.interface';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('Verification')
    private readonly verificationModel: Model<IVerification>,
    private readonly mailService: MailService,
  ) {}

  async sendVerificationEmail(email: string) {
    const verificationCode = await this.generateVerificationCode(
      verificationOptions.length,
    );
    const codeExpiration = new Date(Date.now() + verificationOptions.expiresIn);
    const unverifiedUser = await this.verificationModel.findOneAndUpdate(
      { email: email },
      {
        verification_code: verificationCode,
        code_expiration: codeExpiration,
      },
      { upsert: true },
    );

    if (!unverifiedUser) {
      await this.verificationModel.findOneAndUpdate(
        { email: email },
        { attemptsLeft: verificationOptions.attempts },
      );
    }

    await this.mailService.sendVerificationCode(email, verificationCode);
    await this.checkUserBlock(unverifiedUser);
  }

  async generateVerificationCode(length: number) {
    const verificationCode = Math.random().toFixed(length).split('.')[1];

    return verificationCode.toString();
  }

  async verifyUser(email: string, verificationCode: string | undefined) {
    const unverifiedUser = await this.verificationModel.findOne({
      email: email,
    });

    if (!unverifiedUser) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.checkUserBlock(unverifiedUser);

    if (!verificationCode) {
      throw new HttpException(
        {
          message: 'Code is not present',
          attemptsLeft: unverifiedUser.attemptsLeft,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      unverifiedUser.verification_code !== verificationCode ||
      unverifiedUser.code_expiration < new Date()
    ) {
      if (unverifiedUser.attemptsLeft > 1) {
        await this.verificationModel.findOneAndUpdate(
          { email: email },
          { attemptsLeft: unverifiedUser.attemptsLeft - 1 },
        );

        throw new HttpException(
          {
            message: 'Wrong attempt!',
            attemptsLeft: unverifiedUser.attemptsLeft - 1,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (unverifiedUser.attemptsLeft === 1) {
        const unverifiedUser = await this.verificationModel.findOneAndUpdate(
          { email: email },
          {
            attemptsLeft: verificationOptions.attempts,
            user_block_expiration: new Date(
              Date.now() + verificationOptions.userBlockExpiration,
            ),
          },
          { new: true },
        );

        const userBlockSec = await this.calculateUserExpiration(unverifiedUser);

        throw new HttpException(
          {
            message: 'Final wrong attempt!',
            attemptsLeft: 0,
            blockSeconds: userBlockSec,
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    }

    await this.verificationModel.findOneAndUpdate(
      { email: email },
      { attemptsLeft: verificationOptions.attempts },
    );
  }

  async getEmailByPassport(passportNumber: string) {
    const user = await this.userModel.findOne({
      passportNumber: passportNumber,
    });

    if (!user) {
      throw new HttpException(
        'User with this passport number does not exist!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { email: user.email };
  }

  async calculateUserExpiration(user: IVerification) {
    const userBlockMilliSec =
      user?.user_block_expiration.getTime() - new Date().getTime();
    return Math.round(userBlockMilliSec / 1000);
  }

  async checkUserBlock(user: IVerification) {
    if (user?.user_block_expiration > new Date()) {
      const userBlockSec = await this.calculateUserExpiration(user);

      throw new HttpException(
        {
          message: 'User is blocked',
          blockSeconds: userBlockSec,
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
