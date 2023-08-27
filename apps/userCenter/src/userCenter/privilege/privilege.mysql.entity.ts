import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum PrivilegeStatus {
  DENY = 0,
  ALLOW = 1,
  NOT_SET = 2
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

@Entity()
export class Privilege {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: null })
  systemId?: number;

  @Column()
  resourceKey: string;

  @Column()
  name: string;

  @Column({ type: 'text', default: null })
  description?: string;

  @Column()
  action: string;

  @Column({ default: PrivilegeStatus.ALLOW })
  status?: PrivilegeStatus;

  @CreateDateColumn()
  createTime?: string;
}
