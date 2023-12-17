import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  type: string;

  @Column()
  jenkinsJob: string;

  @Column()
  docker: string;
}
