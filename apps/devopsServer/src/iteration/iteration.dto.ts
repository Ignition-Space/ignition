/*
 * @Author: Cookie
 * @Description: 用户模块 dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { IterationStatus, updateVersionType } from './iteration.entity';
import { HasIteration, IsValidVersion } from './iteration.validator';
import { ProcessNodes } from './process/process.entity';

export class CreateIterationDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: 'yyds' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1.0.1' })
  @IsValidVersion()
  @IsNotEmpty()
  version: string;

  // 是否多分支管理
  multiBranch?: boolean;

  // 预留产品需求字段
  productDemand?: string;

  // 更新类型
  @ApiProperty({ example: '0', enum: updateVersionType })
  @IsNotEmpty()
  versionType: updateVersionType;

  // 绑定发布计划
  @ApiProperty({ example: 1 })
  fplanId?: number;
}

export class UpdateStatusDto {
  iterationId: number;
  environment: number;
  projectType: string;
  // 审核单表单数据
  approvalData?: string;
}

export class CompleteIterationDto {
  @ApiProperty({ example: 2 })
  iterationId: number;
}

export class ListItWithPaginationDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({ example: IterationStatus.doing, enum: IterationStatus })
  status?: IterationStatus;

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams;

  @ApiProperty({ example: 1 })
  fplanId?: number;
}

export class DisableIterationDto {
  @ApiProperty({ example: 1 })
  @HasIteration()
  @IsNotEmpty()
  iterationId: number;
}

export class DisableActivePlanItDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  fplanId: number;
}

export class ValidIterationDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: [0, 2], enum: IterationStatus })
  @IsNotEmpty()
  status: IterationStatus[];
}

export class ValidIterationNewDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: [0, 2], enum: IterationStatus })
  @IsNotEmpty()
  status: IterationStatus[];

  @ApiProperty({ example: [] })
  @IsNotEmpty()
  appSubtype: string[];

  @ApiProperty({ default: '1', enum: ProcessNodes })
  @IsNotEmpty()
  environment: ProcessNodes;
}

export class ValidIterationNewVo {
  iterationId?: number;
  name: string;
  version: string;
}

export class SearchConditionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: IterationStatus.doing, enum: IterationStatus })
  status?: IterationStatus;

  @ApiProperty({ example: 1 })
  fplanId?: number;
}

export class ListDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  projectId?: number;

  @ApiProperty({ example: [IterationStatus.doing], enum: [IterationStatus] })
  @IsArray()
  status?: IterationStatus[];

  startTime?: number;

  endTime?: number;

  @ApiProperty({ example: 1 })
  fplanId?: number;
}
