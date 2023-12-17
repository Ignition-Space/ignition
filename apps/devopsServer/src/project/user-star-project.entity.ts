import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserStaredProject {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId: number;

  @Column()
  projectId: number;
}
