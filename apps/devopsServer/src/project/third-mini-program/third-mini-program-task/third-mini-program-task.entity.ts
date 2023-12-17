import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { ApiResponseProperty } from '@nestjs/swagger';

@Entity()
export class ThirdMiniProgramTask {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: null })
  projectId: number;

  @Column({ default: null })
  thirdMiniProgramId: number;

  @Column({ default: null })
  thirdMiniProgramName: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime?: string;

  @Column()
  taskId: number;

  @Column({ default: null })
  status?: number;

  @Column({ default: null })
  imgPath?: string;

  @Column({ default: null })
  extJson?: string;

  @Column({ default: null })
  tplId?: string;
}
