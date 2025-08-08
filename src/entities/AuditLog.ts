import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    user_id: string;

    @Column({ length: 50 })
    entity_type: string;

    @Column({ length: 36, nullable: true })
    entity_id: string;

    @Column({ length: 20 })
    action: string;

    @Column({ type: 'jsonb', nullable: true })
    old_values: Record<string, any>;

    @Column({ type: 'jsonb', nullable: true })
    new_values: Record<string, any>;

    @Column({ type: 'inet', nullable: true })
    ip_address: string | undefined;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;
}