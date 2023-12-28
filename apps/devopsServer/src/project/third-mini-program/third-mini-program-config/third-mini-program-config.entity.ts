import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { ApiResponseProperty } from '@nestjs/swagger';

@Entity()
export class ThirdMiniProgramConfig {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: null })
  projectId: number;

  @Column({ default: null })
  environment: number;

  @Column({ default: null })
  interface: string;

  @Column({ type: 'json', default: null })
  config?: string;

  @Column({ default: 0 })
  status?: number;
}
