import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  projectId: number;

  @Column()
  iterationId: number;

  @Column()
  name: string;

  @Column()
  creatorId: number;

  @Column({ default: null })
  remarks?: string;

  @Column({ default: null })
  updateUserId: number;

  @Column({ default: null })
  branchStatus?: string;

  @Column({ default: null })
  gitBranchName: string;
}
