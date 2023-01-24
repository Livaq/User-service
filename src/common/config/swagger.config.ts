import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('A-Infinity')
  .setDescription(
    'NodeJS REST api documentation for A-Infinity banking application',
  )
  .setVersion('0.0.3')
  .addServer('http://10.10.14.77:8000/api/v1', 'User Service')
  .addBearerAuth()
  .build();
