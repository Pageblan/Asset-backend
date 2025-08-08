import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_trails')
export class AuditTrail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    user_id: string;

    @Column({ length: 20 })
    action: string;
    
    @Column({ length: 50 })
    entity_type: string;
    
    @Column({ length: 100 })
    entity_id: string;

    @Column({ length: 255 })
    resource: string;

    @Column({ length: 50 })
    ip_address: string;
    
    @Column({ length: 255 })
    user_agent: string;

    @Column({ type: 'text', nullable: true })
    request_data: string;

    @Column({ type: 'text', nullable: true })
    response_data: string;
    
    // Add this property
    @Column({ type: 'text', nullable: true })
    new_values: string;

    @Column({ type: 'integer' })
    status_code: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;
}