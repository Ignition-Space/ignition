import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class Project {
  @ObjectIdColumn()
  id?: number;

  @Column()
  zhName: string;

  // 作为部署项目的前缀路径名
  @Column()
  enName: string;

  @Column({ default: null })
  desc: string;

  @Column('simple-array')
  projectTypes: string[];

  // git project fields

  @Column({ default: null })
  gitProjectId: number;

  @Column({ default: null })
  gitNamespace: string;

  @Column({ default: null })
  gitProjectUrl: string;

  @Column({ default: null })
  gitProjectName: string;

  @Column({ default: null })
  gitProjectDesc: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime?: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime?: string;

  @Column()
  creatorName: string;

  @Column()
  creatorId: number;

  @Column()
  status: string;
}
