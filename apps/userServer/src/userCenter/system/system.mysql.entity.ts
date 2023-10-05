import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum STATUS {
  disabled = 0,
  enabled = 1,
}
@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ type: 'text', default: null })
  description?: string;

  @Column({ default: STATUS.enabled })
  status?: STATUS;

  @Column()
  creatorId?: number;

  @Column()
  creatorName?: string;

  @Column()
  updateId?: number;

  @Column()
  updateName?: string;

  @CreateDateColumn()
  createTime?: string;

  @UpdateDateColumn()
  updateTime?: string;
}
