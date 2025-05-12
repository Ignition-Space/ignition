import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';

export enum STATUS {
  disabled = 0,
  enabled = 1,
}
@Entity()
export class System {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ type: 'text', default: null })
  description?: string;

  @Column({ default: STATUS.enabled })
  status?: STATUS;

  @Column()
  creatorId?: string;

  @Column()
  creatorName?: string;

  @Column()
  updateId?: string;

  @Column()
  updateName?: string;

  @CreateDateColumn()
  createTime?: string;

  @UpdateDateColumn()
  updateTime?: string;
}
