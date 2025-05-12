import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class UserStaredProject {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  userId: number;

  @Column()
  projectId: number;
}
