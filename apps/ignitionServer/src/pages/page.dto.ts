import { PaginationDto } from '@app/common';
import { ENV_TYPE } from '@ignitionServer/application/application.mongo.entity';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DEVICE_TYPE, PAGE_TYPE } from './page.mongo.entity';

class PageVersionCreateDto {
  @ApiProperty({
    type: 'string',
    maxLength: 50,
    description: '迭代版本',
    default: '0.1.0',
  })
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    type: 'string',
    maxLength: 50,
    description: '迭代 id',
  })
  @IsNotEmpty()
  iterationId: string;

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

class PageVersionUpdateDto extends PageVersionCreateDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;
}

export class PageCreateDTO {
  @ApiProperty({
    description: '页面名称',
    default: '商品中心',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '页面路由',
    default: '/path',
  })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: '页面描述', default: 'desc' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '所属应用ID',
    default: '70691333-0fcc-4f00-99c5-4669c5c7c3e3',
  })
  @IsNotEmpty()
  appId: string;

  @ApiProperty({ enum: [0, 1], description: '设备类型' })
  device: string;

  @ApiProperty({ enum: [0, 1], description: '页面状态' })
  status: string;
}

export class PageUpdateDto extends PageCreateDTO {
  @ApiProperty({ required: false, description: '页面ID' })
  @IsNotEmpty()
  id: string;
}

@ApiExtraModels(PageVersionUpdateDto)
export class PageDeployDto extends PageCreateDTO {
  @ApiProperty({
    required: false,
    description: '页面ID',
    default: 'f9d135a0-1854-4f6b-8e50-a0acd07718f5',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    type: 'array',
    items: {
      $ref: getSchemaPath(PageVersionUpdateDto),
    },
    description: '页面迭代版本',
  })
  @IsNotEmpty()
  pageVersion: PageVersionUpdateDto;
}

export class PageQueryDto extends PaginationDto {
  @ApiProperty({
    type: 'string',
    default: '',
  })
  name?: string;

  @ApiProperty({ description: '所属应用ID', default: '' })
  appId?: string;

  @ApiProperty({ description: '所属应用ID', default: '' })
  showMe?: true;
}

export class PageDetailDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;
}

export class addPageDto {
  @ApiProperty({ example: '/home' })
  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  @ApiProperty({ example: '631a94d2593f1aa2a85d5de7' })
  siteId: string;

  @IsNotEmpty()
  @ApiProperty({ example: '631a9ed2fc0ca4a4616c76fe' })
  interfaceId: string;

  @ApiProperty({ example: 'website' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '61efc1c078b2d45cb889df8a' })
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({ example: PAGE_TYPE.csr, enum: PAGE_TYPE })
  @IsNotEmpty()
  type: PAGE_TYPE;

  @ApiProperty({ example: DEVICE_TYPE.pc, enum: DEVICE_TYPE })
  @IsNotEmpty()
  device: DEVICE_TYPE;
}

export class updatePageDto extends addPageDto {
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  id: string;
}

export class findPageDto {
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  id: string;
}

export class PageRestoreDto {
  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  snapshotId: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  pageId: string;
}
export class searchPageDto {
  @ApiProperty({ example: '61efcb879070245f2b7036b6' })
  @IsNotEmpty()
  siteId: string;
}

export enum ENV_OUT_NODES {
  'offline' = 0,
  'online' = 1,
}
