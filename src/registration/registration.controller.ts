import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateNoClientDto } from './dto/create-no-client.dto';
import { GetClientStatusDto } from './dto/getClientStatus.dto';
import { ClientStatusDto } from './dto/clientStatus.dto';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @ApiTags('Registration')
  @ApiOperation({ summary: 'Get Client registration status' })
  @ApiResponse({
    status: 200,
    description: 'Successful get of a client status',
    type: ClientStatusDto,
  })
  @ApiQuery({ description: 'email query', example: 'email@email.com' })
  @Get()
  getClientRegistrationStatus(@Query() getClientStatus: GetClientStatusDto) {
    return this.registrationService.getClientRegistrationStatus(
      getClientStatus,
    );
  }

  @ApiTags('Registration')
  @ApiOperation({ summary: 'Non-Client registration' })
  @ApiResponse({
    status: 200,
    description: 'Successful registration of a non-client user',
  })
  @ApiResponse({
    status: 400,
    description: 'User with this email already exists',
  })
  @Post('/user-profile/new')
  registerNonClientUser(@Body() createNoClient: CreateNoClientDto) {
    return this.registrationService.registerNonClientUser(createNoClient);
  }

  @ApiTags('Registration')
  @ApiOperation({ summary: 'Client registration' })
  @ApiResponse({
    status: 200,
    description: 'Successful registration of a client',
  })
  @ApiResponse({
    status: 400,
    description: 'Client with this email does not exist',
  })
  @Patch('/user-profile')
  registerClientUser(@Body() createClientDto: CreateClientDto) {
    return this.registrationService.registerClientUser(createClientDto);
  }
}
