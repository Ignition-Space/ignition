import { STATUS_TYPE } from '../../site/site.mongo.entity';

import {
  Entity,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PageConfig {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  pageId: string;

  @Column()
  version: string;

  @Column({ type: 'simple-json' })
  config?: string;

  @Column({ default: STATUS_TYPE.inactive })
  status: STATUS_TYPE;

  @Column()
  creator: string;
  @Column()
  creatorId: number;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;
}
