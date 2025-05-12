import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class RolePrivilege {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ default: null })
  systemId?: string;

  @Column()
  roleId: string;

  @Column()
  privilegeId: string;
}
