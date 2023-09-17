import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: null })
  systemId?: number;

  @Column()
  userId: number;

  @Column()
  roleId: number;
}