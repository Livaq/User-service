import { Body, Controller, Patch, Post, Query } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PassportNumberDto } from './dto/passportNumber.dto';
import { VerificationDto } from './dto/verification.dto';
import { EmailDto } from './dto/email.dto';

@Controller('/security/session')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @ApiTags('Verification')
  @ApiResponse({
    status: 200,
    description: 'Email was sent successfully',
  })
  @ApiResponse({
    status: 406,
    description: 'User is blocked',
  })
  @ApiOperation({ summary: 'Sending OTP on email' })
  @ApiQuery({ description: 'email query', example: 'email@email.com' })
  @Patch()
  sendVerificationEmail(@Query() query: { receiver: string }) {
    return this.verificationService.sendVerificationEmail(query.receiver);
  }

  @ApiTags('Verification')
  @ApiOperation({ summary: 'User verification' })
  @ApiResponse({
    status: 200,
    description: 'User successfully past verification',
  })
  @ApiResponse({
    status: 400,
    description: 'User got wrong verification attempt',
  })
  @ApiResponse({
    status: 406,
    description: 'User is blocked',
  })
  @Post('/verification')
  verifyUser(@Body() verificationDto: VerificationDto) {
    return this.verificationService.verifyUser(
      verificationDto.receiver,
      verificationDto.verificationCode,
    );
  }

  @ApiTags('Verification')
  @ApiOperation({ summary: 'Get email by passport' })
  @ApiResponse({
    status: 200,
    description: 'Successful receipt of email',
    type: EmailDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User with this passport number does not exist',
  })
  @Post()
  getEmailByPassport(
    @Body() passportNumberDto: PassportNumberDto,
  ): Promise<EmailDto> {
    return this.verificationService.getEmailByPassport(
      passportNumberDto.passportNumber,
    );
  }
}
