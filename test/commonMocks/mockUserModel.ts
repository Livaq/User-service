import { IUser } from '../../src/registration/interfaces/registration.interface';
import mongoose from 'mongoose';
import { verificationOptions } from '../../src/common/config/verification-options.config';

export const mockUserDto: IUser = {
  _id: new mongoose.Types.ObjectId(),
  email: 'email@email.com',
  password: '$2a$05$.uqYTSlQcuOpUtVAsIdgbeqC4JTWvNCaY6k93rAEnM7acO0SyMp/y',
  passportNumber: 'AAA333',
  securityQuestion: 'Question?',
  ownSecurityQuestion: null,
  securityAnswer: 'Answer.',
  refreshToken: '$2a$05$L1kndv5Tn3wVJXX6tgR8BuGIUfshDwIpEQZ4TOgj7uMmub/jfW2BS',
  verification_code: '123456',
  code_expiration: new Date(Date.now() + verificationOptions.expiresIn),
  attemptsLeft: verificationOptions.attempts,
  user_block_expiration: new Date(1),
};

export const mockUserModel = {
  findOne: jest.fn().mockResolvedValue(mockUserDto),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockUserDto),
  findOneAndUpdate: jest.fn().mockResolvedValue(mockUserDto),
  findById: jest.fn().mockResolvedValue(mockUserDto),
  exec: jest.fn().mockResolvedValue(mockUserDto),
  getUserByEmail: jest.fn().mockResolvedValue(mockUserDto),
  create: jest.fn().mockResolvedValue(mockUserDto),
};
