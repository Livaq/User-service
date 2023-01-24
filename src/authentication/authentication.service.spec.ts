import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidateUserDto } from './dto/validateUser.dto';
import { mockUserModel } from '../../test/commonMocks/mockUserModel';
import { LoginType } from './interfaces/loginType.enum';
import mongoose from 'mongoose';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),
        JwtModule.register({}),
      ],
      providers: [
        AuthenticationService,
        JwtService,
        ConfigService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('validateUser', () => {
    it(' if input is correct it should return tokens', async () => {
      const mockValidateDto: ValidateUserDto = {
        login: 'email@email.com',
        password: 'Qwerty123',
        type: LoginType.email,
      };

      const validateUserCall = await service.validateUser(mockValidateDto);

      expect(validateUserCall).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('if password is wrong it should throw an error : Incorrect input', () => {
      const mockValidateDto: ValidateUserDto = {
        login: 'email@email.com',
        password: 'Qwerty123qqq',
        type: LoginType.email,
      };

      expect(service.validateUser(mockValidateDto)).rejects.toThrowError(
        'Incorrect input',
      );
    });

    it('if user is not found it should throw an error : Incorrect input', () => {
      const mockValidateDto: ValidateUserDto = {
        login: 'email@email.com',
        password: 'Qwerty123',
        type: LoginType.email,
      };

      jest.spyOn(mockUserModel, 'findOne').mockImplementation(() => undefined);

      expect(service.validateUser(mockValidateDto)).rejects.toThrowError(
        'Incorrect input',
      );
    });
  });

  describe('updateRefreshToken', () => {
    it('if input input is correct it should call findByIdAndUpdate method', () => {
      expect(mockUserModel.findByIdAndUpdate).toBeCalled();
    });
  });

  describe('generateTokens', () => {
    it('if input is correct it should return generated tokens', async () => {
      const mockData = {
        id: new mongoose.Types.ObjectId(),
      };

      const generateTokensCall = await service.generateTokens(mockData.id);

      expect(generateTokensCall).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });

  describe('refreshTokens', () => {
    it('if user exists and have refreshToken it should return new an tokens', async () => {
      const mockData = {
        id: '6397011fec535432056aa177',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....-rbsJUOGfgdfNQ-7CCI1Cjg',
      };
      const refreshTokensCall = await service.refreshTokens(
        mockData.id,
        mockData.refreshToken,
      );

      expect(refreshTokensCall).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('if user does not exist or does not have refreshToken it should throw an error : Access denied', () => {
      const mockData = {
        id: '6397011fec535432056aa177',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....-rbsJUOGfgdfNQ-7CCI1Cjg',
      };

      jest.spyOn(mockUserModel, 'findById').mockImplementation(() => undefined);

      expect(
        service.refreshTokens(mockData.id, mockData.refreshToken),
      ).rejects.toThrowError('Access denied');
    });
  });
  describe('changePassword', () => {
    it('if input is correct it should make hashed password and call findOneAndUpdate method', async () => {
      const mockEmail = 'email@email.com';
      const mockPassword = 'Qwerty123';
      await service.changePassword(mockPassword, mockEmail);
      expect(mockUserModel.findOneAndUpdate).toBeCalled();
    });
  });
});
