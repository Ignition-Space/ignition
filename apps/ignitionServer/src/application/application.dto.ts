import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationDto } from '@app/common';
import {
  DomainCreateDto,
  DomainUpdateDto,
} from '@ignitionServer/application/domain/domain.dto';

export class AppDetailDto {
  @ApiProperty({
    type: 'string',
  })
  id?: string;
}

export class AppQueryDto extends PaginationDto {
  @ApiProperty({
    type: 'string',
    default: '',
  })
  name?: string;
}

@ApiExtraModels(DomainCreateDto)
export class AppCreateDto {
  @ApiProperty({
    type: 'string',
    maxLength: 50,
    description: '应用名称',
    example: '应用名称',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    maxLength: 50,
    description: 'appName',
    example: 'is-space',
  })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: 'array',
    items: {
      $ref: getSchemaPath(DomainCreateDto),
    },
  })
  @IsNotEmpty()
  domains: DomainCreateDto[];

  @ApiProperty({
    type: 'string',
    maxLength: 100,
    description: '应用描述',
    example: '搭建系统',
  })
  @IsNotEmpty()
  description: string;
}

@ApiExtraModels(DomainUpdateDto)
export class AppUpateDto extends AppCreateDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    type: 'array',
    items: {
      $ref: getSchemaPath(DomainUpdateDto),
    },
  })
  @IsNotEmpty()
  domains: DomainUpdateDto[];
}
