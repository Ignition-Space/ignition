import { ProcessNodes } from '@devopsServer/iteration/process/process.entity';

import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IMicroConfig {
  projectId: number;
  iterationId?: number;
}
@Entity()
export class DeployHistory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  projectId: number;

  @Column()
  projectType: string;

  @Column()
  taskId: number;

  @Column()
  iterationId: number;

  @Column()
  version: string;

  @Column()
  environment: ProcessNodes;

  @Column({ type: 'simple-json', default: null })
  microConfig?: IMicroConfig[];

  @Column({ type: 'simple-json', default: null })
  rnConfig?: string;

  @Column({ default: null })
  htmlAdr?: string;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;
}
