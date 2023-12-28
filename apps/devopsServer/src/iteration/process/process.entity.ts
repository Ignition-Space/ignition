import { updateVersionType } from '@devopsServer/iteration/iteration.entity';
import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

// 这里的每个流程都是一个节点，请勿窜用。
export enum ProcessNodes {
  development = 0, // 已创建 开发环境任务（Task）
  testing = 1, // 已创建 测试环境任务
  fix = 2, // 已创建 预发任务
  production = 3, // 已创建 生产环境任务
  pre = 4, // 线上预发任务
  apply_for_test = 5, // 申请提交 测试环境
  apply_for_fix = 6, // 申请提交 预发环境
  apply_for_production = 7, // 申请提交 生产环境
  production_not_merge = 8, //  生产发布成功，未合并分支
  completed = 9, // 已完成
}

export const ProcessEnvGroupNames = {
  [ProcessNodes.development]: 'dev',
  [ProcessNodes.testing]: 'test',
  [ProcessNodes.apply_for_test]: 'test',
  [ProcessNodes.fix]: 'fix',
  [ProcessNodes.pre]: 'fix',
  [ProcessNodes.apply_for_fix]: 'fix',
  [ProcessNodes.production]: 'prod',
  [ProcessNodes.apply_for_production]: 'prod',
} as const;

export const PublishRules = {
  [ProcessNodes.production]: [
    ProcessNodes.development,
    ProcessNodes.testing,
    ProcessNodes.fix,
    ProcessNodes.production,
  ],
  [ProcessNodes.fix]: [
    ProcessNodes.development,
    ProcessNodes.testing,
    ProcessNodes.fix,
    ProcessNodes.production,
  ],
  [ProcessNodes.apply_for_fix]: [ProcessNodes.fix],
  [ProcessNodes.testing]: [
    ProcessNodes.development,
    ProcessNodes.testing,
    ProcessNodes.fix,
  ],
  [ProcessNodes.development]: [ProcessNodes.development, ProcessNodes.testing],
};

export const getPublishEnvs = (currentProcessNode: ProcessNodes) => {
  switch (currentProcessNode) {
    case ProcessNodes.development:
      return [ProcessNodes.development];
    case ProcessNodes.apply_for_test:
      return [ProcessNodes.development];

    case ProcessNodes.testing:
      return [ProcessNodes.development, ProcessNodes.testing];
    case ProcessNodes.apply_for_fix:
      return [ProcessNodes.development, ProcessNodes.testing];

    case ProcessNodes.fix:
      return [ProcessNodes.development, ProcessNodes.testing, ProcessNodes.fix];
    case ProcessNodes.apply_for_production:
      return [ProcessNodes.development, ProcessNodes.testing, ProcessNodes.fix];
    case ProcessNodes.production:
      return [ProcessNodes.development, ProcessNodes.testing, ProcessNodes.fix];
  }
};

@Entity()
export class Process {
  @Column()
  @Generated('uuid')
  id?: string;

  @PrimaryColumn({ name: 'project_type' })
  projectType: string;

  @PrimaryColumn({ name: 'project_id' })
  projectId: number;

  @PrimaryColumn({ name: 'iteration_id' })
  iterationId: number;

  @Column({ default: null })
  devCurrentTaskId?: number;

  @Column({ default: null })
  testCurrentTaskId?: number;

  @Column({ default: null })
  fixCurrentTaskId?: number;

  @Column({ default: null })
  prodCurrentTaskId?: number;

  @Column({ default: null })
  currentProcessNode?: ProcessNodes;

  @Column({ default: null })
  currentEnvBranch?: string;

  @Column({ default: updateVersionType.bugfix })
  updateVersionType?: updateVersionType;
}
