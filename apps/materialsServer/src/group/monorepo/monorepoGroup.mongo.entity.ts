import {
  Entity,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MonorepoGroup {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ default: null })
  name: string;

  @Column()
  projectId: number;

  @Column({ default: null })
  desc: string;

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

  @Column()
  creatorName: string;

  @Column()
  creatorId: number;

  @Column()
  status: number;
}
