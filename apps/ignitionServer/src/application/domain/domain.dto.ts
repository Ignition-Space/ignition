import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ENV_TYPE } from './domain.mongo.entity';

export class DomainCreateDto {
  @ApiProperty({
    type: 'string',
    maxLength: 50,
    description: '应用域名',
    example: 'www.ig.com',
  })
  @IsNotEmpty()
  domain: string;

  @ApiProperty({
    type: 'string',
    maxLength: 50,
    description: '环境',
    example: 0,
    enum: [0, 1],
  })
  @IsNotEmpty()
  env: ENV_TYPE;
}

export class DomainUpdateDto extends DomainCreateDto {
  @ApiProperty({
    type: 'string',
  })
  id?: string;
}
