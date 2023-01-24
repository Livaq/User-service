import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from './verification.service';
import { MailService } from '../mail/mail.service';
import { getModelToken } from '@nestjs/mongoose';
import { mockUserModel } from '../../test/commonMocks/mockUserModel';
import { mockUserDto } from '../../test/commonMocks/mockUserModel';
import { verificationOptions } from '../common/config/verification-options.config';
import { mockVerificationModel } from '../../test/commonMocks/mockVerificationModel';
import { mockVerificationDocument } from '../../test/commonMocks/mockVerificationModel';

describe('VerificationService', () => {
  let service: VerificationService;

  const mockMailService = {
    sendVerificationCode: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken('Verification'),
          useValue: mockVerificationModel,
        },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
  });

  describe('sendVerificationEmail', () => {
    const mockEmail = mockVerificationDocument.email;

    it('should call findOneAndUpdate method', async () => {
      await service.sendVerificationEmail(mockEmail);
      expect(mockVerificationModel.findOneAndUpdate).toBeCalled();
    });

    it('should throw an error if user have block time', () => {
      jest.spyOn(mockVerificationModel, 'findOneAndUpdate').mockResolvedValue({
        ...mockUserDto,
        user_block_expiration: new Date(
          Date.now() + verificationOptions.userBlockExpiration,
        ),
      });
      expect(service.sendVerificationEmail(mockEmail)).rejects.toThrowError(
        'User is blocked',
      );
    });
  });

  describe('generateVerificationCode', () => {
    it('should generate digit code based on options length and return as a string', async () => {
      const generateVerificationCodeCall =
        await service.generateVerificationCode(verificationOptions.length);
      expect(generateVerificationCodeCall).toEqual(expect.any(String));
    });
  });

  describe('verifyUser', () => {
    const mockEmail = mockUserDto.email;
    const mockVerificationCode = mockUserDto.verification_code;
    const mockWrongVerificationCode = '654321';

    it('should call findOneAndUpdate method', async () => {
      await service.verifyUser(mockEmail, mockVerificationCode);
      expect(mockVerificationModel.findOneAndUpdate).toBeCalled();
    });

    it('should throw an error if user is not found', () => {
      jest.spyOn(mockVerificationModel, 'findOne').mockResolvedValue(undefined);
      expect(
        service.verifyUser(mockEmail, mockVerificationCode),
      ).rejects.toThrowError('User with this email does not exist');
    });

    it('should throw an error if user has active block time', () => {
      jest.spyOn(mockVerificationModel, 'findOne').mockResolvedValue({
        ...mockUserDto,
        user_block_expiration: new Date(
          Date.now() + verificationOptions.userBlockExpiration,
        ),
      });
      expect(
        service.verifyUser(mockEmail, mockVerificationCode),
      ).rejects.toThrowError('User is blocked');
    });

    it('should throw an error if verification code is not present', () => {
      jest
        .spyOn(mockVerificationModel, 'findOne')
        .mockResolvedValue(mockUserDto);
      expect(service.verifyUser(mockEmail, undefined)).rejects.toThrowError(
        'Code is not present',
      );
    });

    it('should throw an error if code does not match and attempts > 1', () => {
      jest
        .spyOn(mockVerificationModel, 'findOne')
        .mockResolvedValue(mockUserDto);
      expect(
        service.verifyUser(mockEmail, mockWrongVerificationCode),
      ).rejects.toThrowError('Wrong attempt!');
    });

    it('should throw an error if code expires and attempts > 1', () => {
      jest.spyOn(mockVerificationModel, 'findOne').mockResolvedValue({
        ...mockUserDto,
        code_expiration: new Date(Date.now() - 10000),
      });
      expect(
        service.verifyUser(mockEmail, mockVerificationCode),
      ).rejects.toThrowError('Wrong attempt!');
    });

    it('should throw an error if code does not match and attempts = 1', () => {
      jest
        .spyOn(mockVerificationModel, 'findOne')
        .mockResolvedValue({ ...mockUserDto, attemptsLeft: 1 });
      expect(
        service.verifyUser(mockEmail, mockWrongVerificationCode),
      ).rejects.toThrowError('Final wrong attempt!');
    });

    it('should throw an error if code expires and attempts = 1', () => {
      jest.spyOn(mockVerificationModel, 'findOne').mockResolvedValue({
        ...mockUserDto,
        code_expiration: new Date(Date.now() - 10000),
        attemptsLeft: 1,
      });
      expect(
        service.verifyUser(mockEmail, mockVerificationCode),
      ).rejects.toThrowError('Final wrong attempt!');
    });
  });

  describe('getEmailByPassport', () => {
    const mockPassportNum = mockUserDto.passportNumber;

    it('should call findOne method', async () => {
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockImplementation(() => mockUserDto);
      await service.getEmailByPassport(mockPassportNum);
      expect(mockUserModel.findOne).toBeCalled();
    });

    it('should throw an error if user is not found', () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementation(() => undefined);
      expect(service.getEmailByPassport(mockPassportNum)).rejects.toThrowError(
        'User with this passport number does not exist!',
      );
    });
  });
});
