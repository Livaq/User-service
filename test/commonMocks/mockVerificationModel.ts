import { verificationOptions } from '../../src/common/config/verification-options.config';
import { IVerification } from '../../src/verification/interfaces/verification.interface';

export const mockVerificationDocument: IVerification = {
  email: 'email@email.com',
  verification_code: '123456',
  code_expiration: new Date(Date.now() + verificationOptions.expiresIn),
  attemptsLeft: verificationOptions.attempts,
  user_block_expiration: new Date(1),
};

export const mockVerificationModel = {
  findOne: jest.fn().mockResolvedValue(mockVerificationDocument),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockVerificationDocument),
  findOneAndUpdate: jest.fn().mockResolvedValue(mockVerificationDocument),
  findById: jest.fn().mockResolvedValue(mockVerificationDocument),
  exec: jest.fn().mockResolvedValue(mockVerificationDocument),
  getUserByEmail: jest.fn().mockResolvedValue(mockVerificationDocument),
  create: jest.fn().mockResolvedValue(mockVerificationDocument),
};
