import {
  Entity,
  Column,
  UpdateDateColumn,
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
} from 'typeorm';

export enum UserStatus {
  disabled = 0,
  enabled = 1,
}

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  password: string;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  username: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  avatarUrl: string;

  @Column({ default: null })
  avatarThumb?: string;

  @Column({ default: null })
  avatarBig?: string;

  @Column({ default: null })
  avatarMiddle?: string;

  @Column({ default: null })
  mobile?: string;

  @Column({ default: null })
  enName?: string;

  @Column({ default: null })
  feishuUnionId?: string;

  @Column({ default: null })
  feishuUserId?: string;

  @Column({ default: null })
  departmentName?: string;

  @Column({ default: null })
  departmentId?: string;

  @Column({ default: UserStatus.enabled })
  status?: UserStatus;

  @CreateDateColumn()
  createTime?: string;

  @UpdateDateColumn()
  updateTime?: string;
}
