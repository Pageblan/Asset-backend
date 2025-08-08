import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Request } from '../entities/Request';
import { Assignment } from '../entities/Assignment';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 50, nullable: false, unique: true })
  code: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => Request, (request) => request.department)
  requests: Request[];

  @OneToMany(() => Assignment, (assignment) => assignment.department)
  assignments: Assignment[];
}