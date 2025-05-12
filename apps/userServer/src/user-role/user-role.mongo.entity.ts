import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class UserRole {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ default: null })
  systemId?: string;

  @Column()
  userId: string;

  @Column()
  roleId: string;
}
