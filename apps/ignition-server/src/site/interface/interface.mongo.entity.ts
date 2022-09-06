import {
  Entity,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  ObjectID,
  UpdateDateColumn,
} from 'typeorm';

export enum API_TYPE {
  'swagger' = 0,
}

@Entity()
export class Interface {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  siteId: string;

  @Column({ default: null })
  url: string;

  @Column({ default: null })
  tags: API_TYPE;

  @Column({ default: null })
  methodType: string;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;
}
