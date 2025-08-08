import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Department } from './Department';
import { Approval } from './Approval';
import { RequestItem } from './RequestItem';

@Entity('requests')
export class Request {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    department_id!: string;

    @Column()
    requester_id!: string;

    @Column({ type: 'text' })
    purpose!: string;

    @Column({ length: 20 })
    status!: string;

    // Add the priority column
    @Column({ length: 20, default: 'medium' })
    priority!: string;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at!: Date;

    @ManyToOne(() => Department, department => department.requests)
    @JoinColumn({ name: 'department_id' })
    department!: Department;

    @OneToMany(() => Approval, approval => approval.request)
    approvals!: Approval[];

    @OneToMany(() => RequestItem, requestItem => requestItem.request)
    items!: RequestItem[];
}