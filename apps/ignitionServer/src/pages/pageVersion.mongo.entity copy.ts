import { STATUS_TYPE } from '../site/site.mongo.entity';

import {
  Entity,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';
import { ENV_TYPE } from '@ignitionServer/application/application.mongo.entity';

@Entity()
export class PageVersion {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    type: 'enum',
    enum: ENV_TYPE,
    comment: '环境',
    default: ENV_TYPE.test,
  })
  env: ENV_TYPE;

  @Column({
    length: 20,
    comment: '版本号',
  })
  version: string;

  @Column({ type: 'uuid', comment: '迭代' })
  iterationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
