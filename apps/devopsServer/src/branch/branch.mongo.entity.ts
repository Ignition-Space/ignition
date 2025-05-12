import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class Branch {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  projectId: string;

  @Column()
  iterationId: string;

  @Column()
  name: string;

  @Column()
  creatorId: string;

  @Column({ default: null })
  remarks?: string;

  @Column({ default: null })
  updateUserId: string;

  @Column({ default: null })
  branchStatus?: string;

  @Column({ default: null })
  gitBranchName: string;
}
