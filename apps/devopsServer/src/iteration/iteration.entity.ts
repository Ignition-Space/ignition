import { ApiProperty } from '@nestjs/swagger';
import { ProcessNodes } from '@devopsServer/iteration/process/process.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum IterationStatus {
  'doing' = 0,
  'done' = 2,
  'deprecated' = 3,
}

export enum updateVersionType {
  version = 1,
  feat = 2,
  bugfix = 3,
  hotfix = 4,
}

@Entity()
export class Iteration {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  projectId: number;

  @Column()
  name: string;

  @Column({ default: false })
  multiBranch?: boolean;

  @Column({ default: null })
  testUser?: string;

  @Column({ default: null })
  preUser?: string;

  @Column({ default: null })
  prodUser?: string;

  @Column({ default: IterationStatus.doing })
  status?: IterationStatus;

  @Column()
  @ApiProperty({
    name: '迭代版本号',
  })
  version: string;

  @ApiProperty({ name: '关联的需求' })
  @Column({ default: null })
  productDemand?: string;

  @Column()
  creatorName: string;

  @Column({ default: 0 })
  currentProcessNode?: ProcessNodes;

  @Column()
  creatorId: number;

  @CreateDateColumn()
  createTime?: string;

  @Column({ default: null })
  codeReviewId?: number;

  @Column({ default: null })
  feishuApprovalInstanceCode?: string;

  @Column({ default: null })
  testMergeIid?: number;

  @Column({ default: null })
  fixMergeIid?: string;

  @Column({ default: null })
  prodTime?: string;

  @Column({ type: 'simple-json', default: null })
  subProcessNodes: { [projectType: string]: ProcessNodes };

  @Column({ default: null })
  updateVersionType?: updateVersionType;

  @Column({ default: 0 })
  alphaVersion?: number;

  @Column({ default: 0 })
  betaVersion?: number;

  @Column({ default: 0 })
  gammaVersion?: number;

  @Column('bigint', { name: 'fplan_id', nullable: true, comment: '发布计划id' })
  fplanId?: number | null;
}
