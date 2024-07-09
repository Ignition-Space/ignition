import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProcessFlow {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column('simple-array')
  nodeIds: number[];
}
