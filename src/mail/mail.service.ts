import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationCode(email: string, verificationCode: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'i.lipouski@andersenlab.com',
        subject: 'Welcome to A-Infinity!',
        template: './verification',
        context: {
          name: email,
          verificationCode: verificationCode,
        },
      });
    } catch (e) {
      console.log(e, 'Email was not sent');
    }
  }
}