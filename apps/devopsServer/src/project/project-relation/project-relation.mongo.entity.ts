import { Entity, Column, ObjectIdColumn, ObjectId, Index } from 'typeorm';

import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProjectRelation {
  @ObjectIdColumn()
  id: ObjectId;

  @ApiProperty({ example: 'hello' })
  @IsNotEmpty()
  @Column()
  projectId: number;

  @Column()
  @Index()
  projectType: string;
}
