import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Platform {
  iOS = 'ios',
  Android = 'android',
}

// 复合主键表格
@Entity()
export class RNBundleHistory {
  @PrimaryGeneratedColumn('increment')
  bundleId?: number;

  @PrimaryColumn({ length: 50 })
  projectName: string;

  @PrimaryColumn({ length: 200 })
  moduleNames: string;

  @PrimaryColumn({ length: 10 })
  version: string;

  @PrimaryColumn({ length: 20 })
  platform: Platform;

  @Column()
  projectId: number;

  @Column()
  downloadUrl: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createTime?: Date;

  @Column()
  md5: string;
}
