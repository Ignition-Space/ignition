import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProjectRelation {
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ example: 'hello' })
  @IsNotEmpty()
  @Column()
  projectId: number;

  @Column()
  @Index()
  projectType: string;
}
