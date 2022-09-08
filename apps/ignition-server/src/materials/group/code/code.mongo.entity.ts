import {
  Entity,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectID,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CodeGroup {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  bizId: string;

  @Column({ default: null })
  bizTitle: string;

  @Column({ default: null })
  desc: string;

  @Column()
  creatorName: string;

  @Column()
  creatorId: number;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;

  @Column()
  status: number;
}
