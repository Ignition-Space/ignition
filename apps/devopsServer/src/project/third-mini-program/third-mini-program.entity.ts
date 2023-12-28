import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

export enum IThirdMiniProgramStatus {
  'notPublish' = 0, // 未发布
  'waitPublish' = 1, // 等待发布
  'publishSuccess' = 2, // 代码上传
  'publishFail' = 3, // 代码上传失败
  'auditing' = 4, // 审核中
  'auditSuccess' = 5, // 审核成功
  'auditFail' = 6, // 审核失败
  'release' = 7, // 发布成功
  'releaseFail' = 8, // 发布失败
}

@Entity()
export class ThirdMiniProgram {
  @PrimaryColumn()
  id?: number;

  @Column({ default: null })
  @PrimaryColumn()
  projectId: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  desc: string;

  @Column({ default: null })
  @PrimaryColumn()
  environment: number;

  @CreateDateColumn({ type: 'timestamp' })
  createTime?: string;

  @Column({ type: 'json', default: null })
  bizConfig?: string;

  @Column({ type: 'json', default: null })
  cusConfig?: string;

  @Column({ type: 'json', default: null })
  extJson?: string;

  @Column({ type: 'json', default: null })
  currentVersion?: string;

  @Column({ type: 'json', default: null })
  lastVersion?: string;

  @Column({ default: 0 })
  status?: number;

  @Column({ default: null })
  templateId?: string;

  @Column({ default: null })
  qrCodeUrl?: string;

  @Column({ default: null })
  errmsg?: string;

  @Column({ default: 0 })
  errcode?: number;

  @Column({ default: null })
  auditId?: number;
}
