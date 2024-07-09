import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ProcessNodes } from '../process.entity';

@Entity()
export class ProcessNode {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  env: ProcessNodes;

  @Column()
  desc: string;

  @Column()
  type: string;

  @Column()
  key: number;
}
