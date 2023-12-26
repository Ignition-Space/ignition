import { ProcessNodes } from '@devopsServer/iteration/process/process.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PublishStatus {
  'unpublished' = 0,
  'publishing' = 1,
  'publish_success' = 2,
  'publish_failed' = 3,
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  projectId: number;

  @Column()
  iterationId: number;

  @Column()
  processId: string;

  @Column()
  branch: string;

  @Column({ default: PublishStatus.unpublished })
  status?: PublishStatus;

  @Column()
  env: ProcessNodes;

  @Column()
  projectType: string;

  @Column({ type: 'text', default: null })
  consoleLog?: string;

  @CreateDateColumn({ type: 'timestamp' })
  startTime?: string;

  @UpdateDateColumn({ type: 'timestamp' })
  endTime?: string;

  @Column()
  creatorName: string;

  @Column()
  creatorId: number;

  @Column()
  queueId: number;

  @Column({ default: null })
  buildId?: number;

  @Column({ type: 'text', default: null })
  desc?: string;

  @Column({ type: 'text', default: null })
  nacosConfig?: string;

  @Column('varchar', {
    name: 'version',
    nullable: true,
    comment: '发布版本(会包含 beta 等)',
    length: 64,
  })
  version?: string | null;
}
