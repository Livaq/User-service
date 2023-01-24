export interface IVerification {
  email: string;
  verification_code: string;
  attemptsLeft?: number;
  user_block_expiration?: Date;
  code_expiration: Date;
}
