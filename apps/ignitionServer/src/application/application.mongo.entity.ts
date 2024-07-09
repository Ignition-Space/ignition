import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

export enum DELETE_FALG {
  enabled = 0,
  disabled = 1,
}
export enum ENV_TYPE {
  test = 0,
  prod = 1,
}

@Entity()
export class Application {
  @ObjectIdColumn()
  id: string;

  @Column({ length: 100, comment: '域名', unique: true })
  domain: string;

  @Column({ comment: '应用 appname', unique: true })
  code: string;

  @Column({ length: 100, comment: '应用描述' })
  description: string;

  @Column()
  createdUser: string;

  @Column()
  createdId: string;

  @Column()
  updatedUser: string;

  @Column()
  updatedId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    default: DELETE_FALG.enabled,
    enum: DELETE_FALG,
    comment: '删除标记',
  })
  deleteFlag: DELETE_FALG;
}
