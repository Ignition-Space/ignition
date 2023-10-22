import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { MATERIAL_TYPE } from './physical.mongo.entity';


export enum ProcessNodes {
  'development' = 0, // 已创建 开发环境任务（Task）
  'testing' = 1, // 已创建 测试环境任务
  'fix' = 2, // 已创建 预发任务
  'production' = 3, // 已创建 生产环境任务
}

export const branchMap = {
  [ProcessNodes.development]: 'dev',
  [ProcessNodes.testing]: 'test',
  [ProcessNodes.fix]: 'fix',
  [ProcessNodes.production]: 'prod',
};

export const versionTypeMap = {
  [ProcessNodes.development]: 'alpha',
  [ProcessNodes.testing]: 'beta',
  [ProcessNodes.fix]: 'gamma',
};

export const versionMap = {
  [ProcessNodes.development]: 'alphaVersion',
  [ProcessNodes.testing]: 'betaVersion',
  [ProcessNodes.fix]: 'gammaVersion',
};

export const staticMap = {
  0: '//dev.static.xyb2b.com.cn',
  1: '//test.static.xyb2b.com.cn',
  2: '//fix.static.xyb2b.com.cn',
  3: '//static.xyb2b.com',
}

export const ProcessMap = {
  0: 'devVersion',
  1: 'testVersion',
  2: 'fixVersion',
  3: 'releaseVersion',
}

export class CreateProjectDto {
  @ApiProperty({ example: 'hello', title: '项目中文名' })
  @IsNotEmpty()
  zhName: string;

  // 作为部署项目的前缀路径名
  @ApiProperty({ example: 'hello', title: '项目中文名' })
  @IsNotEmpty()
  usName: string;

  @ApiProperty({ example: '我是项目描述' })
  desc: string;

  @ApiProperty({ example: ['weapp', 'web'] })
  projectTypes?: string[];

  @ApiProperty({ example: 685 })
  gitProjectId: number;

  @ApiProperty({ example: '//cdn.com' })
  cdnUrl: string;
}

export class addMaterialDto extends CreateProjectDto {

  @ApiProperty({ example: [MATERIAL_TYPE.npm], enum: MATERIAL_TYPE })
  type?: MATERIAL_TYPE[];

  @ApiProperty({ example: 685 })
  groupId: number;
}

export class searchMaterialDto {
  @ApiProperty({ example: '11' })
  groupId: string;
}

export class searchMaterialByIdsDto {
  @ApiProperty({ example: '[11]' })
  @IsNotEmpty()
  groupIds: string[];

  @ApiProperty({ example: '11', enum: ProcessNodes })
  @IsNotEmpty()
  env: ProcessNodes;
}

export class searchMaterialDetailDto {
  @ApiProperty({ example: '11' })
  id: string;

  @ApiProperty({ example: '11' })
  projectId?: string;
}

export class editMaterialDetailDto extends addMaterialDto {
  @ApiProperty({ example: '11' })
  @IsNotEmpty()
  id: string;
}

export class PublishDto extends searchMaterialDetailDto {
  @ApiProperty({
    example: ProcessNodes.development,
    enum: ProcessNodes,
  })
  @IsEnum(ProcessNodes)
  environment: ProcessNodes;

  @ApiProperty({ example: false, description: '是否使用缓存' })
  cache?: boolean;

  @ApiProperty({ example: '描述', description: '项目描述' })
  desc?: string;

  @ApiProperty({ example: '["npm"]', description: '项目类型' })
  projectTypes?: string[];

  @ApiProperty({ example: '0.0.1', description: '版本号' })
  version?: string;

  @ApiProperty({ example: 'dev', description: '版本号' })
  branch?: string;
}