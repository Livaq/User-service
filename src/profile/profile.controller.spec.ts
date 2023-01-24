import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ChangeNotificationStatusDto } from './dto/changeNotificationStatus.dto';
import { ChangeControlAnswerDto } from './dto/changeControlAnswer.dto';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

describe('ProfileController', () => {
  let controller: ProfileController;
  const mockId = '63935f2c6f9b24c10c3d80bc';
  const mockProfileService = {
    changeEmailSubscriptionStatus: jest.fn((dto, id) => undefined),
    changeControlAnswer: jest.fn((dto, id) => undefined),
    changeEmail: jest.fn((dto, id) => undefined),
    receiveClientInfo: jest.fn((id) => undefined),
    changePassword: jest.fn((dto, id) => undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [ProfileService],
    })
      .overrideProvider(ProfileService)
      .useValue(mockProfileService)
      .compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  describe('change email subscription Status', () => {
    const mockChangeNotificationStatusDto: ChangeNotificationStatusDto = {
      notificationStatus: true,
    };

    it('it should call profileService', async () => {
      await controller.changeEmailSubscriptionStatus(
        mockChangeNotificationStatusDto,
        mockId,
      );
      expect(mockProfileService.changeEmailSubscriptionStatus).toBeCalledWith(
        mockChangeNotificationStatusDto.notificationStatus,
        mockId,
      );
    });
  });

  describe('change security question and answer', () => {
    const mockChangeControlAnswerDto: ChangeControlAnswerDto = {
      securityQuestion: 'What is your mothers Surname?',
      ownSecurityQuestion: 'What is your favourite food?',
      securityAnswer: 'Some secret answer.',
    };

    it('it should call profileService', async () => {
      await controller.changeControlAnswer(mockChangeControlAnswerDto, mockId);
      expect(mockProfileService.changeControlAnswer).toBeCalledWith(
        mockChangeControlAnswerDto,
        mockId,
      );
    });
  });

  describe('change email', () => {
    const mockChangeEmailDto: ChangeEmailDto = {
      newEmail: 'new_email@email.com',
    };

    it('it should call profileService', async () => {
      await controller.changeEmail(mockChangeEmailDto, mockId);
      expect(mockProfileService.changeEmail).toBeCalledWith(
        mockChangeEmailDto.newEmail,
        mockId,
      );
    });
  });

  describe('change password to a new password', () => {
    const mockChangePasswordDto: ChangePasswordDto = {
      password: 'D4c3b2a1',
      newPassword: 'A1b2c3d4',
    };

    it('it should call profileService', async () => {
      await controller.changePassword(mockChangePasswordDto, mockId);
      expect(mockProfileService.changePassword).toBeCalledWith(
        mockChangePasswordDto,
        mockId,
      );
    });
  });
});
