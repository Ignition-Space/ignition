import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';
import { STATUS } from '../system/system.mongo.entity';

@Entity()
export class Role {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  systemId: string;

  @Column()
  systemName: string;

  @Column()
  creatorId: string;

  @Column()
  creatorName: string;

  @Column()
  updateId: string;

  @Column()
  updateName: string;

  @Column({ default: STATUS.enabled })
  status?: STATUS;

  @Column({ type: 'text', default: null })
  description?: string;

  @CreateDateColumn()
  createTime?: string;

  @UpdateDateColumn()
  updateTime?: string;
}
