import { STATUS_TYPE } from '../site/site.mongo.entity';

import {
  Entity,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';

export enum PAGE_TYPE {
  'csr' = 0,
  'ssr' = 1,
}

export enum DEVICE_TYPE {
  'pc' = 0,
  'mobile' = 1,
  'weapp' = 2,
  'rn' = 3,
}

@Entity()
export class Page {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  siteId: string;

  @Column()
  domainId: string;

  @Column({ default: null })
  path: string;

  @Column()
  name: string;

  @Column({ default: null })
  currentConfigId: string;

  @Column({ default: null })
  deployConfigId: string;

  @Column({ default: null })
  currentVersion: string;

  @Column({ default: null })
  deployVersion: string;

  @Column()
  templateId: string;

  // 页面渲染类型
  @Column()
  type: PAGE_TYPE;

  // 设备类型
  @Column()
  device: DEVICE_TYPE;

  // site 状态
  @Column({ default: STATUS_TYPE.inactive })
  status: STATUS_TYPE;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;

  @UpdateDateColumn({ default: null })
  appointmentUp: string;

  @UpdateDateColumn({ default: null })
  appointmentDown: string;
}
