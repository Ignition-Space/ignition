import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class System {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  type: string;

  @Column()
  jenkinsJob: string;

  @Column()
  docker: string;
}
