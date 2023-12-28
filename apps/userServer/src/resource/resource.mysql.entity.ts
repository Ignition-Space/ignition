import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { STATUS } from '../system/system.mysql.entity';

export enum ResourceType {
  Menu = 'menu',
  Nomal = 'nomal',
}

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  key: string;

  @Column({ default: 0 })
  sort?: number;

  @Column({ default: null })
  parentId?: number;

  @Column()
  systemId: number;

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
