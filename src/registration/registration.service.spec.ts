import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './registration.service';
import { mockUserModel } from '../../test/commonMocks/mockUserModel';
import { getModelToken } from '@nestjs/mongoose';
import { CreateNoClientDto } from './dto/create-no-client.dto';
import { CreateClientDto } from './dto/create-client.dto';

describe('RegistrationService', () => {
  let service: RegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
  });

  describe('register NonClient User', () => {
    const mockCreateNonClientDto: CreateNoClientDto = {
      email: 'email5@email.com',
      password: '12345',
      securityQuestion: 'Test?',
      securityAnswer: '1!',
      firstName: 'Glek',
      middleName: 'Kekovich',
      lastName: 'Glek',
      appRegistrationDate: new Date(),
      accessionDate: new Date(),
      passportNumber: 'AAA333',
      isResident: true,
      clientStatus: 'REGISTERED_NOT_CLIENT',
    };
    it(' if input is correct it should call create method', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementation(() => undefined);

      await service.registerNonClientUser(mockCreateNonClientDto);

      expect(mockUserModel.create).toBeCalled();
    });

    it('if email already exist it should throw an error : User with such email already exists', () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(true);

      expect(
        service.registerNonClientUser(mockCreateNonClientDto),
      ).rejects.toThrowError('User with this email already exists');
    });
  });

  describe('register Client User', () => {
    const mockCreateClientDto: CreateClientDto = {
      email: 'email5@email.com',
      password: '12345',
      securityQuestion: 'Test?',
      securityAnswer: '1!',
    };

    const mockClientResponse = {
      email: 'email5@email.com',
      password: '12345',
      securityQuestion: 'Test?',
      securityAnswer: '1!',
      clientStatus: 'REGISTERED_NOT_CLIENT',
    };

    const mockClientNotRegisteredResponse = {
      email: 'email5@email.com',
      password: '12345',
      securityQuestion: 'Test?',
      securityAnswer: '1!',
      clientStatus: 'NOT_REGISTERED_CLIENT_NOT_ACTIVE',
    };

    it(' if input is correct it should call create method', async () => {
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockResolvedValue(mockClientNotRegisteredResponse);

      await service.registerClientUser(mockCreateClientDto);

      expect(mockUserModel.findOneAndUpdate).toBeCalled();
    });

    it('if email do not exist it should throw an error : Client with that email do not exist', () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(false);

      expect(
        service.registerClientUser(mockCreateClientDto),
      ).rejects.toThrowError('Client with this email does not exist');
    });

    it('if user is already registered it should throw an error : Client with this email is already registered', () => {
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockResolvedValue(mockClientResponse);

      expect(
        service.registerClientUser(mockCreateClientDto),
      ).rejects.toThrowError('Client with this email is already registered');
    });
  });

  describe('Check Client Registration Status', () => {
    const mockStatusCheck = { email: 'email5@email.com' };
    const mockUserResponse = {
      email: 'email5@email.com',
      password: '12345',
      securityQuestion: 'Test?',
      securityAnswer: '1!',
      firstName: 'Glek',
      middleName: 'Kekovich',
      lastName: 'Glek',
      passportNumber: 'AAA333',
      isResident: true,
      appRegistrationDate: new Date(),
      accessionDate: new Date(),
      clientStatus: 'REGISTERED_NOT_CLIENT',
    };

    it(' if input is correct it should return email and status', async () => {
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockImplementation(() => mockUserResponse);

      const statusCheckCall = await service.getClientRegistrationStatus(
        mockStatusCheck,
      );

      expect(statusCheckCall).toEqual({
        email: expect.any(String),
        clientStatus: expect.any(String),
      });
    });

    it(' if input is incorrect it should return email and special status', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockImplementation(() => undefined);

      const statusCheckCall = await service.getClientRegistrationStatus(
        mockStatusCheck,
      );

      expect(statusCheckCall).toEqual({
        email: expect.any(String),
        clientStatus: 'NOT_REGISTERED_NOT_CLIENT',
      });
    });
  });
});
