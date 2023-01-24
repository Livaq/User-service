import { Body, Controller, Get, Headers, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChangeNotificationStatusDto } from './dto/changeNotificationStatus.dto';
import { ChangeControlAnswerDto } from './dto/changeControlAnswer.dto';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { ChangePasswordDto } from '../authentication/dto/changePassword.dto';

@Controller('/user/settings')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiTags('Profile')
  @ApiOperation({ summary: 'Change email notification status' })
  @ApiResponse({
    status: 200,
    description: 'Email subscription status was successfully changed',
  })
  @ApiResponse({
    status: 400,
    description: 'User with this id does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Token is invalid',
  })
  @ApiBearerAuth()
  @Patch('notifications/email')
  changeEmailSubscriptionStatus(
    @Body() dto: ChangeNotificationStatusDto,
    @Headers('ainf-userid') id: string,
  ) {
    return this.profileService.changeEmailSubscriptionStatus(
      dto.notificationStatus,
      id,
    );
  }

  @ApiTags('Profile')
  @ApiOperation({ summary: 'Change control Answer and Question' })
  @ApiResponse({
    status: 200,
    description: 'Control answer was successfully changed',
  })
  @ApiResponse({
    status: 400,
    description: 'User with this id does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Token is invalid',
  })
  @ApiBearerAuth()
  @Patch('/controls')
  changeControlAnswer(
    @Body() dto: ChangeControlAnswerDto,
    @Headers('ainf-userid') id: string,
  ) {
    return this.profileService.changeControlAnswer(dto, id);
  }

  @ApiTags('Profile')
  @ApiOperation({ summary: 'Change email' })
  @ApiResponse({
    status: 200,
    description: 'Email was successfully changed',
  })
  @ApiResponse({
    status: 400,
    description: 'User with this id does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Token is invalid',
  })
  @ApiBearerAuth()
  @Patch('email')
  changeEmail(@Body() dto: ChangeEmailDto, @Headers('ainf-userid') id: string) {
    return this.profileService.changeEmail(dto.newEmail, id);
  }

  @ApiTags('Profile')
  @ApiOperation({ summary: "Receive client's info" })
  @ApiResponse({
    status: 200,
    description: 'Client info was successfully received',
  })
  @ApiResponse({
    status: 400,
    description: 'User with this id does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Token is invalid',
  })
  @ApiBearerAuth()
  @Get('/information')
  receiveClientInfo(@Headers('ainf-userid') id: string) {
    return this.profileService.receiveClientInfo(id);
  }

  @ApiTags('User Controller')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200 })
  @Patch('password')
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Headers('ainf-userid') id: string,
  ) {
    return this.profileService.changePassword(dto, id);
  }
}
