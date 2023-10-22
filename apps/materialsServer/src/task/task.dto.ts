import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, } from 'class-validator';
import { PaginationParams } from 'types/type';

import { PublishStatus } from './task.mongo.entity';


export class SearchConditionDto {
  @ApiProperty({ example: 1 })
  projectId?: number;

  @ApiProperty({ example: 1 })
  iterationId?: number;

  @ApiProperty({ example: 1 })
  processId?: string;

  @ApiProperty({ example: PublishStatus.publish_success, enum: PublishStatus })
  @IsEnum(PublishStatus)
  status?: PublishStatus;
}

export class ListWithPaginationDto {
  @ApiProperty({ example: 1 })
  projectId?: number;

  @ApiProperty({ example: 1 })
  iterationId?: number;

  @ApiProperty({ example: 1 })
  processId?: string;

  @ApiProperty({ example: PublishStatus.publish_success, enum: PublishStatus })
  status?: PublishStatus;

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams;
}

export class UpdateTaskDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ enum: PublishStatus, example: PublishStatus.publish_success })
  status: number;
  buildId: number;
  thirdMiniIds?: number[];
}

export class QueryByEmailDto {
  @ApiProperty({ example: ['cookieboty@qq.com'] })
  emails: string[];
}
