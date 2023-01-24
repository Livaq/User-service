import { mongooseId } from '../../common/interfaces/id.interface';

export interface IUser {
  _id?: mongooseId;
  email?: string;
  password?: string;
  securityQuestion?: string;
  ownSecurityQuestion?: string | null;
  securityAnswer?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  passportNumber?: string;
  isResident?: boolean;
  appRegistrationDate?: Date;
  accessionDate?: Date;
  clientStatus?: string;
  refreshToken?: string;
  email_subscription?: boolean;
  verification_code?: string;
  code_expiration?: Date;
  user_block_expiration?: Date;
  attemptsLeft?: number;
}
