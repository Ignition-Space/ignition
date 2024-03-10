import { DELETE_FALG } from '@ignitionServer/Application/application.mongo.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';


export enum ITERATION_STATUS {
  inporcess = 0,
  finish = 1,
  abandon = 2,
}

export enum RECORD_TYPE {
  PUBLISH = 0,
  ROLLBACK = 1,
  GREY = 2,
}

@Entity()
export class Iteration {
  @ObjectIdColumn()
  id: string;

  @Column({ comment: '页面ID' })
  pageId: string;

  @Column({ comment: '迭代版本号' })
  version: string;

  @Column({ length: 200, comment: '迭代描述' })
  description: string;

  @Column({ comment: '搭建schema' })
  schema: object;

  @Column({ comment: '迭代锁定用户' })
  lockUserId: string;

  @Column({
    type: 'enum',
    enum: ITERATION_STATUS,
    default: ITERATION_STATUS.inporcess,
  })
  status: ITERATION_STATUS;

  @Column({ comment: '预留上线时间字段' })
  autoPubTime: Date;

  @Column()
  createdUser: string;

  @Column()
  createdId: string;

  @Column()
  updatedUser: string;

  @Column()
  updatedId: string;

  @CreateDateColumn({})
  createdAt: Date;

  @UpdateDateColumn({})
  updatedAt: Date;
}
