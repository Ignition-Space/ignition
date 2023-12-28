import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';
import { ProcessNodes } from '../physical/physical.dto';

export enum MATERIAL_TYPE {
  'cdn' = 0,
  'npm' = 1,
  'code' = 2,
}

@Entity()
export class MaterialConfig {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  materialId: string;

  @Column()
  env: ProcessNodes;

  @Column()
  version: string;

  @Column({ type: 'simple-json' })
  contain?: string;

  @Column()
  cdn?: string;
}
