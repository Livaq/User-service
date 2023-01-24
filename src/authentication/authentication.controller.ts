import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidateUserDto } from './dto/validateUser.dto';
import { ITokens } from './interfaces/tokens.interface';
import { TokensDto } from './dto/tokens.dto';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('login')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'User authentication' })
  @ApiResponse({
    status: 200,
    description: 'User logged successfully and got tokens',
    type: TokensDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User passed incorrect login or password',
  })
  @Post()
  validateUser(@Body() dto: ValidateUserDto): Promise<ITokens> {
    return this.authenticationService.validateUser(dto);
  }

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Update refresh token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully got pair of tokens',
    type: TokensDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User did not pass refresh token validation',
  })
  @UseGuards(RefreshTokenGuard)
  @Get('/token')
  refreshTokens(@Req() req): Promise<ITokens> {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authenticationService.refreshTokens(userId, refreshToken);
  }

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: 200,
    description: 'User successfully changed password',
  })
  @Patch('/password')
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Query('email') userEmail: string,
  ) {
    return this.authenticationService.changePassword(
      dto.newPassword,
      userEmail,
    );
  }
}
