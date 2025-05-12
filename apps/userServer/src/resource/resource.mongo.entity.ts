import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';
import { STATUS } from '../system/system.mongo.entity';

export enum ResourceType {
  Menu = 'menu',
  Nomal = 'nomal',
}

@Entity()
export class Resource {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  key: string;

  @Column({ default: 0 })
  sort?: number;

  @Column({ default: null })
  parentId?: string;

  @Column()
  systemId: string;

  @Column({ default: ResourceType.Nomal })
  type: ResourceType;

  @Column({ default: STATUS.enabled })
  status?: STATUS;

  @Column({ type: 'text', default: null })
  description?: string;

  @CreateDateColumn()
  createTime?: string;

  @UpdateDateColumn()
  updateTime?: string;
}
