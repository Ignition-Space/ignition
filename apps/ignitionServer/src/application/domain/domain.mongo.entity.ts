import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

export enum ENV_TYPE {
  test = 0,
  prod = 1,
}

@Entity()
export class Domain {
  @ObjectIdColumn()
  id: string;

  @Column()
  appId: string;

  @Column({ length: 100, comment: '域名', unique: true })
  domain: string;

  @Column({
    type: 'enum',
    enum: ENV_TYPE,
    comment: '环境',
    default: ENV_TYPE.test,
  })
  env: ENV_TYPE;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
