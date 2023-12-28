import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectId,
} from 'typeorm';

import { ProcessNodes } from '../material/physical/physical.dto';

export enum PublishStatus {
  'unpublished' = 0,
  'publishing' = 1,
  'publish_success' = 2,
  'publish_failed' = 3,
}

@Entity()
export class Task {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column({ default: null })
  materialId?: string;

  @Column({ default: null })
  groupId?: string;

  @Column()
  deployNum: number;

  @Column()
  branch: string;

  @Column()
  deployVersion: string;

  @Column()
  version: string;

  @Column()
  currentVersion: string;

  @Column({ default: PublishStatus.unpublished })
  status: PublishStatus;

  @Column()
  env: ProcessNodes;

  @CreateDateColumn({ type: 'timestamp' })
  startTime?: string;

  @UpdateDateColumn({ type: 'timestamp' })
  endTime?: string;

  @Column()
  creatorName: string;

  @Column()
  creatorId: number;

  @Column()
  queueId?: number;

  @Column({ default: null })
  buildId?: number;

  @Column({ type: 'text', default: null })
  desc?: string;
}
