import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangeNotificationStatusDto {
  @ApiProperty({
    example: 'true',
    description: 'Email notification status',
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly notificationStatus: boolean;
}
