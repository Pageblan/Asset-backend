import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Request } from './Request';
import { Assignment } from './Assignment';

@Entity('departments')
export class Department {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 100, unique: true })
    name!: string;
  
    @Column({ length: 255, nullable: false, unique: true })
    email!: string;
  
    @Column({ length: 10, unique: true })
    code!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 100, nullable: true })
    location?: string;

    @Column({ default: true })
    is_active!: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at!: Date;

    @OneToMany(() => Request, request => request.department)
    requests!: Request[];

    @OneToMany(() => Assignment, assignment => assignment.department)
    assignments!: Assignment[];
  assets: any;
}