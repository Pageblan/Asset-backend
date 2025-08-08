import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Request } from './Request';

@Entity('approvals')
export class Approval {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    request_id: string;

    @Column({ length: 100 })
    approver_id: string;

    @Column({ length: 20 })
    status: string;

    @Column({ type: 'text', nullable: true })
    comments?: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    approved_at: Date;

    @ManyToOne(() => Request, request => request.approvals)
    @JoinColumn({ name: 'request_id' })
    request: Request;
}