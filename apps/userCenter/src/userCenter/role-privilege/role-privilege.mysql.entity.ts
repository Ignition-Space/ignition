import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RolePrivilege {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: null })
  systemId?: number;

  @Column()
  roleId: number;

  @Column()
  privilegeId: number;
}