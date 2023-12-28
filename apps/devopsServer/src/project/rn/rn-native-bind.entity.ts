import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Platform } from './rn-bundle-history.entity';

export const enum BundleUseStrategy {
  latest = 'latest', // 使用最后一个 bundle 版本
  fixed_verson = 'fixed_verson', // 使用一个固定的 bundle 版本
}

@Entity()
export class NativeBindedBundles {
  @PrimaryGeneratedColumn('increment')
  bindedId?: number;

  @Column()
  nativeProjectId: number;

  @Column()
  projectId: number;

  @Column()
  platform: Platform;

  @Column()
  moduleNames: string;

  // 默认使用 latest 策略，即使用最后一个版本的 bundle 进行绑定
  @Column({ default: BundleUseStrategy.latest })
  useStrategy: BundleUseStrategy;

  // 在使用 latest 策略时，忽略该值
  @Column({ default: null })
  version: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createTime?: Date;
}
