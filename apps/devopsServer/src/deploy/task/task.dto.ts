import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { ProcessNodes } from '@devopsServer/iteration/process/process.entity';
import { PublishStatus } from './task.entity';

import { IJenkinsType } from '@devopsServer/common/jenkins/jenkins.dto';

interface microModule {
  projectId: number;
  iterationId: number;
}

export enum IPublishType {
  'normal' = 0,
  'micro' = 1,
  'microChild' = 2,
}

export const versionTypeMap = {
  [ProcessNodes.development]: 'alpha',
  [ProcessNodes.testing]: 'beta',
  [ProcessNodes.fix]: 'gamma',
  [ProcessNodes.pre]: 'gamma',
};

export const versionMap = {
  [ProcessNodes.development]: 'alphaVersion',
  [ProcessNodes.testing]: 'betaVersion',
  [ProcessNodes.fix]: 'gammaVersion',
  [ProcessNodes.pre]: 'gamma',
};

export enum PublishPreCheckResult {
  valid = 0,
  tip = 1,
  warn = 2,
  hasNotMergeProd = 3,
}

export class PublishDto {
  @ApiProperty({ example: 1 })
  iterationId: number; // 迭代 id，这个换成 java

  @ApiProperty({
    example: ProcessNodes.development,
    enum: ProcessNodes,
  })
  @IsEnum(ProcessNodes)
  environment: ProcessNodes; // 发布环境

  @ApiProperty({ example: 'web' })
  projectType: IJenkinsType; // 发布类型

  thirdMiniIds?: number[]; // 第三方小程序 ids

  @ApiProperty({ example: false })
  cache?: boolean; // 是否缓存

  @ApiProperty({ example: false })
  lock?: boolean; // 是否锁环境

  @ApiProperty({ example: '描述' })
  desc?: string; // 描述

  @ApiProperty({ example: 1 })
  nodeId?: number; // 发布节点 id

  @ApiProperty({ example: 1, enum: IPublishType })
  publishType?: IPublishType; // 部署类型

  @ApiProperty({ example: 1 })
  microModules?: microModule[]; // 微服务模块
}

export enum PublishTypeEnum {
  /**
   * 等待基础服务回调，确认发布状态
   */
  buildAndDeploy = 1,
  /**
   * 显式声明，接口调用成功即为发布成功
   */
  deployOnly = 2,
}

export class PublishNewDto {
  @ApiProperty({})
  userId: number;

  @ApiProperty({})
  userEmail: string;

  @ApiProperty({})
  userName: string;

  @ApiProperty({ example: 1 })
  iterationId?: number;

  @ApiProperty({ example: 1 })
  targetBranch: string; // 分支名

  @ApiProperty({
    example: ProcessNodes.development,
    enum: ProcessNodes,
  })
  @IsEnum(ProcessNodes)
  environment: ProcessNodes; // 发布环境

  @ApiProperty({ example: 1 })
  appId: number;

  @ApiProperty({ example: '0.0.01' })
  deployVersion: string;

  @ApiProperty({ example: 1 })
  taskId: string;

  @ApiProperty({ example: 'web' })
  projectType: IJenkinsType; // 发布类型

  thirdMiniIds?: number[]; // 第三方小程序 ids

  @ApiProperty({ example: false })
  cache?: boolean; // 是否缓存

  @ApiProperty({ example: false })
  lock?: boolean; // 是否锁环境

  @ApiProperty({ example: '描述' })
  desc?: string; // 描述

  @ApiProperty({ example: 1 })
  nodeId?: number; // 发布节点 id

  @ApiProperty({ example: 1, enum: PublishTypeEnum })
  publishType: PublishTypeEnum; // 部署类型

  @ApiProperty({ example: 1 })
  microModules?: microModule[]; // 微服务模块

  @ApiProperty({ example: JSON.stringify({ hello: 123, demo: 'demo' }) })
  extra?: string; // 自由扩展字段
}

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

  buildId?: number;

  thirdMiniIds?: number[];
}

export class UpdateTaskIronDto {
  @ApiProperty({ example: 1 })
  id: number;
  /**
   * 构建结果,示例值(SUCCESS,FAILURE,ABORTED)
   */
  result: number;
  /**
   * 1-构建阶段，2-部署阶段
   */
  hookStep: number;
  buildId: number;
}

export enum TaskExtraFields {
  version = 'version',
  microConfig = 'microConfig',
}
export class QueryByEmailDto {
  @ApiProperty({ example: [''] })
  emails: string[];
}

export class RollbackDto {
  @ApiProperty({ example: '0.0.1', description: '回退版本' })
  @IsNotEmpty()
  rollbackVersion: string;
  @ApiProperty({ example: '0', description: '应用ID' })
  @IsNotEmpty()
  appId: number;
  @ApiProperty({ example: 'web', description: '应用子类型' })
  @IsNotEmpty()
  projectType: IJenkinsType;
}

export class RollbackDiffDto extends RollbackDto {
  @ApiProperty({ example: '0.0.1', description: '线上版本' })
  @IsNotEmpty()
  onlineVersion: string;
}
