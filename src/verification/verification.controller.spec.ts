import { Test, TestingModule } from '@nestjs/testing';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { PassportNumberDto } from './dto/passportNumber.dto';
import { mockUserDto } from '../../test/commonMocks/mockUserModel';
import { mockVerificationDocument } from '../../test/commonMocks/mockVerificationModel';

describe('VerificationController', () => {
  let controller: VerificationController;

  const mockEmailDto = {
    email: mockUserDto.email,
  };

  const passportNumberDto: PassportNumberDto = {
    passportNumber: mockUserDto.passportNumber,
  };

  const mockVerificationDto = {
    receiver: mockVerificationDocument.email,
    verificationCode: mockVerificationDocument.verification_code,
  };

  const mockVerificationService = {
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    verifyUser: jest.fn().mockResolvedValue(undefined),
    getEmailByPassport: jest.fn().mockResolvedValue(mockEmailDto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationController],
      providers: [VerificationService],
    })
      .overrideProvider(VerificationService)
      .useValue(mockVerificationService)
      .compile();

    controller = module.get<VerificationController>(VerificationController);
  });

  describe('sendVerificationEmail', () => {
    const mockReceiver = { receiver: mockVerificationDocument.email };

    it('should call verificationService when sendVerificationEmail is called', async () => {
      await controller.sendVerificationEmail(mockReceiver);
      expect(mockVerificationService.sendVerificationEmail).toBeCalledWith(
        mockReceiver.receiver,
      );
    });
  });

  describe('verifyUser', () => {
    it('should call verificationService when verifyUser is called', async () => {
      await controller.verifyUser(mockVerificationDto);
      expect(mockVerificationService.verifyUser).toBeCalledWith(
        mockVerificationDto.receiver,
        mockVerificationDto.verificationCode,
      );
    });
  });

  describe('getEmailByPassport', () => {
    it('should call verificationService when getEmailByPassport is called', async () => {
      await controller.getEmailByPassport(passportNumberDto);
      expect(mockVerificationService.getEmailByPassport).toBeCalledWith(
        passportNumberDto.passportNumber,
      );
    });

    it('should return email when getEmailByPassport is called', async () => {
      const getEmailByPassportCall = await controller.getEmailByPassport(
        passportNumberDto,
      );
      expect(getEmailByPassportCall).toEqual(mockEmailDto);
    });
  });
});
