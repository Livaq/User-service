import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getModelToken } from '@nestjs/mongoose';
import { mockUserModel } from '../../test/commonMocks/mockUserModel';
import { ChangeNotificationStatusDto } from './dto/changeNotificationStatus.dto';
import { ChangeControlAnswerDto } from './dto/changeControlAnswer.dto';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { IUser } from '../registration/interfaces/registration.interface';
import mongoose from 'mongoose';

describe('ProfileService', () => {
  let service: ProfileService;
  const mockChangeNotificationStatusDto: ChangeNotificationStatusDto = {
    notificationStatus: true,
  };
  const mockChangeControlAnswerDto: ChangeControlAnswerDto = {
    securityQuestion: 'What is your mothers Surname?',
    ownSecurityQuestion: 'What is your favourite food?',
    securityAnswer: 'Some secret answer.',
  };
  const mockChangeEmailDto: ChangeEmailDto = {
    newEmail: 'new_email@email.com',
  };

  const mockChangePasswordDto: ChangePasswordDto = {
    password: 'D4c3b2a1',
    newPassword: 'A1b2c3d4',
  };
  const mockId = '63935f2c6f9b24c10c3d80bc';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  describe('changeControlAnswer', () => {
    it('it should call findByIdAndUpdate method', async () => {
      await service.changeControlAnswer(mockChangeControlAnswerDto, mockId);

      expect(mockUserModel.findByIdAndUpdate).toBeCalled();
    });

    it('if user does not exist it should throw an error : User with this id does not exist', () => {
      jest
        .spyOn(mockUserModel, 'findByIdAndUpdate')
        .mockImplementation(() => undefined);

      expect(
        service.changeControlAnswer(mockChangeControlAnswerDto, mockId),
      ).rejects.toThrowError('User with this id does not exist');
    });
  });

  describe('changeEmailSubscriptionStatus', () => {
    it('it should call findByIdAndUpdate method', async () => {
      jest
        .spyOn(mockUserModel, 'findByIdAndUpdate')
        .mockImplementation(() => 'Some user');

      await service.changeEmailSubscriptionStatus(
        mockChangeNotificationStatusDto.notificationStatus,
        mockId,
      );

      expect(mockUserModel.findByIdAndUpdate).toBeCalled();
    });

    it('if user does not exist it should throw an error : User with this id does not exist', () => {
      jest
        .spyOn(mockUserModel, 'findByIdAndUpdate')
        .mockImplementation(() => undefined);

      expect(
        service.changeEmailSubscriptionStatus(
          mockChangeNotificationStatusDto.notificationStatus,
          mockId,
        ),
      ).rejects.toThrowError('User with this id does not exist');
    });
  });

  describe('changeEmail', () => {
    it('it should call findByIdAndUpdate method', async () => {
      jest
        .spyOn(mockUserModel, 'findByIdAndUpdate')
        .mockImplementation(() => 'Some user');

      await service.changeEmail(mockChangeEmailDto.newEmail, mockId);
      expect(mockUserModel.findByIdAndUpdate).toBeCalled();
    });

    it('if user does not exist it should throw an error : User with this ID does not exist', () => {
      jest
        .spyOn(mockUserModel, 'findByIdAndUpdate')
        .mockImplementation(() => undefined);

      expect(
        service.changeEmail(mockChangeEmailDto.newEmail, mockId),
      ).rejects.toThrowError('User with this ID does not exist');
    });
  });

  describe('changePassword', () => {
    const mockUserDto: IUser = {
      _id: new mongoose.Types.ObjectId(),
      email: 'email@email.com',
      password: '$2a$05$ZFRAajunTCcpuKSFlJdxFO69NJAxVV9Kn8PtIejenNdoHI9CKEcRC',
    };

    const mockUserWrongPasswordDto: IUser = {
      _id: new mongoose.Types.ObjectId(),
      email: 'email@email.com',
      password: '$2a$06$ZFRAajunTCcpuKSFlJdxFO69NJAxVV9Kn8PtIejenNdoHI9CKEcRC',
    };
    it('it should call findOne method', async () => {
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockImplementation(() => mockUserDto);

      await service.changePassword(mockChangePasswordDto, mockId);

      expect(mockUserModel.findOne).toBeCalled();
    });

    it('it should call findByIdAndUpdate method', async () => {
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockImplementation(() => mockUserDto);

      await service.changePassword(mockChangePasswordDto, mockId);

      expect(mockUserModel.findByIdAndUpdate).toBeCalled();
    });

    it('if user does not exist it should throw an error : Unauthorized', () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementation(() => undefined);

      expect(
        service.changePassword(mockChangePasswordDto, mockId),
      ).rejects.toThrowError('Unauthorized');
    });

    it('if password does not matches it should throw an error : Incorrect password', () => {
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockImplementation(() => mockUserWrongPasswordDto);

      expect(
        service.changePassword(mockChangePasswordDto, mockId),
      ).rejects.toThrowError('Incorrect password');
    });
  });
});
