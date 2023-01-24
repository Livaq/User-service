import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from './interfaces/registration.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateNoClientDto } from './dto/create-no-client.dto';
import { ClientStatusEnum } from './enums/clientStatus.enum';
import { GetClientStatusDto } from './dto/getClientStatus.dto';

@Injectable()
export class RegistrationService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async registerNonClientUser(user: CreateNoClientDto) {
    const candidate = await this.userModel.findOne({ email: user.email });
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(user.password, 5);
    await this.userModel.create({
      ...user,
      password: hashPassword,
      appRegistrationDate: new Date(),
      accessionDate: new Date(),
      clientStatus: ClientStatusEnum.REGISTERED_NOT_CLIENT,
    });
  }

  async registerClientUser(user: CreateClientDto) {
    const candidate = await this.userModel.findOne({ email: user.email });
    if (!candidate) {
      throw new HttpException(
        'Client with this email does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      candidate.clientStatus !==
        ClientStatusEnum.NOT_REGISTERED_CLIENT_ACTIVE &&
      candidate.clientStatus !==
        ClientStatusEnum.NOT_REGISTERED_CLIENT_NOT_ACTIVE
    ) {
      throw new HttpException(
        'Client with this email is already registered',
        HttpStatus.BAD_REQUEST,
      );
    }
    const status =
      candidate.clientStatus == ClientStatusEnum.NOT_REGISTERED_CLIENT_ACTIVE
        ? ClientStatusEnum.REGISTERED_CLIENT_ACTIVE
        : ClientStatusEnum.REGISTERED_CLIENT_NOT_ACTIVE;
    const hashPassword = await bcrypt.hash(user.password, 5);
    await this.userModel.findOneAndUpdate(
      {
        email: user.email,
      },
      {
        ...user,
        password: hashPassword,
        clientStatus: status,
      },
    );
  }

  async getClientRegistrationStatus(query: GetClientStatusDto) {
    const candidate = await this.userModel.findOne({ email: query.email });
    if (candidate) {
      return {
        email: candidate.email,
        clientStatus: candidate.clientStatus,
      };
    }
    return {
      email: query.email,
      clientStatus: ClientStatusEnum.NOT_REGISTERED_NOT_CLIENT,
    };
  }
}
