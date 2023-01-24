import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokensDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9...',
    description: 'Access token',
  })
  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9...',
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}
