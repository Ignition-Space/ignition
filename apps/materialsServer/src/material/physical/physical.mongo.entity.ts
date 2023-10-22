import {
  Entity,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn
} from 'typeorm';

export enum MATERIAL_TYPE {
  'cdn' = 0,
  'npm' = 1,
  'code' = 2,
}

@Entity()
export class PhysicalMaterial {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  groupId: string;

  @Column()
  projectId: number;

  @Column()
  type: string;

  @Column()
  devVersion: string;

  @Column()
  testVersion: string;

  @Column()
  fixVersion: string;

  @Column()
  releaseVersion: string;

  @Column()
  alphaVersion: number;

  @Column()
  betaVersion: number;

  @Column()
  gammaVersion: number;

  @Column()
  currentVersion: string;

  @Column()
  lastVersion: string;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;

  @UpdateDateColumn()
  updateUser: string;
}
