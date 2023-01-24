import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

describe('RegistrationController', () => {
  let controller: RegistrationController;

  const mockRegistrationNonClient = {
    email: 'email10@email.com',
    password: 'abc',
    securityQuestion: 'Test?',
    securityAnswer: '1!',
    firstName: 'Sergey',
    middleName: 'Vasilevich',
    lastName: 'Popov',
    passportNumber: 'AAA333',
    isResident: true,
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9',
    appRegistrationDate: new Date(),
    accessionDate: new Date(),
    clientStatus: 'REGISTERED_NOT_CLIENT',
  };

  const mockRegistrationClient = {
    email: 'email7@email.com',
    password: '12345',
    securityQuestion: 'Test?',
    securityAnswer: '1!',
    ownSecurityQuestion: 'How am I?',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9',
  };

  const mockRegistrationCheck = {
    email: 'email5@email.com',
    clientStatus: 'REGISTERED_NOT_CLIENT',
  };

  const mockRegistrationService = {
    registerNonClientUser: jest.fn().mockResolvedValue(undefined),
    registerClientUser: jest.fn().mockResolvedValue(undefined),
    getClientRegistrationStatus: jest
      .fn()
      .mockResolvedValue(mockRegistrationCheck),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [RegistrationService],
    })
      .overrideProvider(RegistrationService)
      .useValue(mockRegistrationService)
      .compile();

    controller = module.get<RegistrationController>(RegistrationController);
  });

  describe('Register User', () => {
    it('it should call registerNonClientUser', async () => {
      await controller.registerNonClientUser(mockRegistrationNonClient);
      expect(mockRegistrationService.registerNonClientUser).toBeCalledWith(
        mockRegistrationNonClient,
      );
    });

    it('it should call registerClientUser', async () => {
      await controller.registerClientUser(mockRegistrationClient);
      expect(mockRegistrationService.registerClientUser).toBeCalledWith(
        mockRegistrationClient,
      );
    });
  });

  describe('Get User Registration Status', () => {
    const emailMock = 'email5@email.com';
    it('it should return email and clientStatus', async () => {
      const statusCall = await controller.getClientRegistrationStatus({
        email: emailMock,
      });
      expect(statusCall).toEqual(mockRegistrationCheck);
    });

    it('it should call getClientRegistrationStatus', async () => {
      await controller.getClientRegistrationStatus({
        email: emailMock,
      });
      expect(
        mockRegistrationService.getClientRegistrationStatus,
      ).toBeCalledWith({
        email: emailMock,
      });
    });
  });
});
