import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class ProjectType {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  type: string;
}
