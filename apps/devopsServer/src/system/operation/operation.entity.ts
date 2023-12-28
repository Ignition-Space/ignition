import { ProcessNodes } from '@devopsServer/iteration/process/process.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum OperationType {
  'create_project' = 0,
  'create_iteration' = 1,
  'create_task' = 2,
  'rollback_project' = 3,
  'delete_project' = 4,
  'apply_for_testing' = 5,
  'prod_publish_success' = 6,
}

export class ApplyForTesting {
  iterationId: number;
}

export class ProdPublishSuccess {
  iterationId: number;
}

export class ProdTaskCompleted {
  startTime: string;
  endTime: string;
  iterationCreateTime: string;
  deployedTime: string;
}

export class CreateProjectRecord {
  projectId: number;
  projectName: string;
}
export class CreateIterationRecord {
  projectId: number;
  iterationId: number;
  iterationName: string;
}

export class CreateTask {
  projectId: number;
  iterationId: number;
  taskId: number;
  projectType: string;
  iterationName: string;
  env: ProcessNodes;
}

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: null })
  operationType: OperationType;

  @Column({ type: 'json' })
  record: string;

  @CreateDateColumn()
  operationTime?: string;

  @Column({ default: null })
  operatorId?: number;

  @Column({ default: null })
  operatorName?: string;
}
