import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from './Asset';

@Entity('maintenance')
export class Maintenance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    asset_id: string;

    @Column({ length: 20 })
    maintenance_type: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'date' })
    scheduled_date: Date;

    @Column({ type: 'date', nullable: true })
    completed_date: Date;

    @Column({ length: 20, default: 'scheduled' })
    status: string;

    @Column({ length: 100, nullable: true })
    performed_by: string;

    // Remove this duplicate field
    // @Column({ length: 100, nullable: true })
    // technician_id: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cost: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @ManyToOne(() => Asset, asset => asset.maintenances)
    @JoinColumn({ name: 'asset_id' })
    asset: Asset;
}