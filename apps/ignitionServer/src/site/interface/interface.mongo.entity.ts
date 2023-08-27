import {
  Entity,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';

import { Method } from 'axios';

export enum API_TYPE {
  'swagger' = 0,
}

@Entity()
export class Interface {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  siteId: string;

  @Column({ default: null })
  url: string;

  @Column({ default: null })
  summary: string;

  @Column({ default: null })
  tags: string;

  @Column({ default: null })
  schema: string;

  @Column({ default: null })
  apiType: API_TYPE;

  @Column({ default: null })
  parameterType: string;

  @Column({ default: null })
  methodType: Method;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;
}
