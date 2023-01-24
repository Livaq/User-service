import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ITokens } from './interfaces/tokens.interface';
import { ValidateUserDto } from './dto/validateUser.dto';
import { LoginType } from './interfaces/loginType.enum';
import { ChangePasswordDto } from './dto/changePassword.dto';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  const mockTokens: ITokens = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....-rbsJdqlrN-7CCI1Cjg',
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....-rbsJUOGfgdfNQ-7CCI1Cjg',
  };

  const mockAuthenticationService = {
    validateUser: jest.fn((dto) => mockTokens),
    refreshTokens: jest.fn((req) => mockTokens),
    changePassword: jest.fn((req) => mockTokens),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [AuthenticationService],
    })
      .overrideProvider(AuthenticationService)
      .useValue(mockAuthenticationService)
      .compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  describe('validate User', () => {
    const mockDto: ValidateUserDto = {
      login: 'email@email.com',
      password: 'Qwerty123',
      type: LoginType.email,
    };

    it('when validateUser is called it should call authenticationService', async () => {
      await controller.validateUser(mockDto);
      expect(mockAuthenticationService.validateUser).toBeCalledWith(mockDto);
    });

    it('when validateUser is called it should return tokens', async () => {
      const validateUserCall = await controller.validateUser(mockDto);

      expect(validateUserCall).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });

  describe('refresh tokens', () => {
    const mockRequest = {
      user: {
        id: '63935f2c6f9b24c10c3d80bc',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....-rbsJUOGfgdfNQ-7CCI1Cjg',
      },
    };

    it('when refreshTokens is called it should call authenticationService', async () => {
      await controller.refreshTokens(mockRequest);
      expect(mockAuthenticationService.refreshTokens).toBeCalledWith(
        mockRequest.user['id'],
        mockRequest.user['refreshToken'],
      );
    });

    it('when refreshTokens is called it should return tokens', async () => {
      const refreshTokensCall = await controller.refreshTokens(mockRequest);
      expect(refreshTokensCall).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });
  describe('Change password', () => {
    const mockDto: ChangePasswordDto = {
      newPassword: 'Qwerty123',
    };
    const mockEmail = 'email@email.com';
    it('when changePassword is called it should call authenticationService', async () => {
      await controller.changePassword(mockDto, mockEmail);
      expect(mockAuthenticationService.changePassword).toBeCalledWith(
        mockDto.newPassword,
        mockEmail,
      );
    });
  });
});
