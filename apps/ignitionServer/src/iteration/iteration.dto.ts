import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationDto } from '@app/common';
import { RECORD_TYPE } from './iteration.mongo.entity';
import { ENV_TYPE } from '@ignitionServer/Application/application.mongo.entity';

export class IterationCreateDTO {
  @ApiProperty({
    description: '迭代名称',
    default: '上新需求',
  })
  name: string;

  @ApiProperty({
    description: '迭代版本号',
    default: '0.1.0',
  })
  @IsNotEmpty()
  version: string;

  @ApiProperty({ description: '迭代描述', default: 'desc' })
  description: string;

  @ApiProperty({
    description: '页面ID',
    default: 'f1f3ea45-96fb-430a-b815-ac50ae7eb841',
  })
  @IsNotEmpty()
  pageId: string;

  @ApiProperty({ description: '页面描述', default: {} })
  schema: object;

  @ApiProperty({ enum: [0, 1, 2], description: '页面状态', default: 0 })
  status: string;
}

export class IterationUpdateDto extends IterationCreateDTO {
  @ApiProperty({
    required: true,
    description: '页面ID',
    default: '66bb4d38-20f2-4efb-b929-2dadd6c3e9b4',
  })
  id: string;

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

export class IterationDeployDto {
  @ApiProperty({
    required: true,
    description: '页面ID',
  })
  id: string;

  @ApiProperty({ description: '页面描述', default: null })
  schema?: object;

  @ApiProperty({
    maxLength: 50,
    description: '环境',
    example: 0,
    enum: [0, 1],
  })
  @IsNotEmpty()
  env: ENV_TYPE;

  @ApiProperty({
    type: 'string',
    description: '发布类型',
    example: 0,
    enum: RECORD_TYPE,
  })
  type: RECORD_TYPE;

  // @ApiProperty({
  //   type: 'string',
  //   description: '发布地区',
  //   example: 'hz',
  //   enum: REGION_TYPE,
  // })
  // region: REGION_TYPE;
}

export class IterationQueryDto extends PaginationDto {
  @ApiProperty({
    type: 'string',
    default: '',
  })
  name?: string;

  @ApiProperty({
    description: '所属应用ID',
  })
  pageId?: string;
}

export class IterationDetailDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
