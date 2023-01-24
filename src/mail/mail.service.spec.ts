import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { mockUserDto } from '../../test/commonMocks/mockUserModel';

describe('MailService', () => {
  let service: MailService;

  const mockMailerService = {
    sendMail: jest.fn().mockImplementation((email, code) => undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService, MailerService],
    })
      .overrideProvider(MailerService)
      .useValue(mockMailerService)
      .compile();

    service = module.get<MailService>(MailService);
  });

  describe('sendVerificationCode', () => {
    const mockInput = {
      email: mockUserDto.email,
      verificationCode: mockUserDto.verification_code,
    };
    it('it should call sendMail method', async () => {
      await service.sendVerificationCode(
        mockInput.email,
        mockInput.verificationCode,
      );
      expect(mockMailerService.sendMail).toBeCalled();
    });
  });
});
