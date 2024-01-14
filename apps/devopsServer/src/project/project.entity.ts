import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export enum ProjectStatus {
  active = 1,
  deleted = 0,
}
@Entity()
export class Project {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  // 中文名，便于识别
  @ApiProperty({ example: 'hello' })
  @IsNotEmpty()
  @Column()
  zhName: string;

  // 作为部署项目的前缀路径名
  @IsNotEmpty()
  @Column()
  usName: string;

  // 描述
  @Column({ default: null })
  desc: string;

  @ApiProperty({ name: '最后一次迭代版本号' })
  @Column({ default: null })
  lastIterationVersion?: string;

  // 项目类型
  @ApiProperty({ example: [1, 2, 3] })
  @IsNotEmpty()
  @Column('simple-array')
  projectTypes: string[];

  // git project fields

  @Column({ default: null })
  gitProjectId: number;

  @Column({ default: null })
  gitNamespace: string;

  @Column({ default: null })
  gitProjectUrl: string;

  @Column({ default: null })
  gitProjectName: string;

  @Column({ default: null })
  gitProjectDesc: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime?: string;

  @Column()
  creatorName: string;

  @Column()
  creatorId: number;

  // 微服务关联id
  @Column({ type: 'simple-array', default: null })
  microserviceIds?: number[];

  // 项目状态
  @Column({ default: ProjectStatus.active })
  status?: number;
}
