import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  PrimaryColumn,
} from 'typeorm';

import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

@Entity()
export class ProjectConfiguration {
  @ApiResponseProperty()
  // @Column()
  @Generated('uuid')
  id?: number;

  @Column({ default: null })
  desc?: string;

  @PrimaryColumn({ name: 'project_id' })
  projectId: number;

  @ApiProperty({ example: 'iOS' })
  @IsNotEmpty()
  @PrimaryColumn({ name: 'project_type' })
  projectType: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime?: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime?: string;

  @Column({ type: 'json', default: null })
  deployConfig?: string;

  @Column({ type: 'json', default: null })
  nacosConfig?: string;

  @Column({ type: 'json', default: null })
  publishConfig?: string;

  @Column({ default: null })
  publishDocker?: string;

  @Column({ default: null })
  builderDocker?: string;

  @Column({ type: 'json', default: null })
  authentication?: string;

  @Column({ type: 'json', default: null })
  onlineMicroConfig?: string;

  @Column({ type: 'json', default: null })
  offlineMicroConfig?: string;
}
