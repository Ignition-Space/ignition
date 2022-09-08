import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

export enum MATERIAL_TYPE {
  'cdn' = 0,
  'npm' = 1,
  'code' = 2,
}

@Entity()
export class MaterialConfig {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  materialId: string;

  @Column()
  version: string;

  @Column({ type: 'simple-json' })
  contain?: string;

  @Column()
  cdn?: string;
}
