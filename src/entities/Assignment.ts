import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from './Asset';
import { Department } from './Department';

@Entity('assignments')
export class Assignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    asset_id: string;

    @Column()
    department_id: string;

    @Column({ length: 100 })
    assigned_by: string;

    @Column({ length: 100, nullable: true })
    assigned_to: string;
    
    @Column({ default: false })
    is_acknowledged: boolean;

    @Column({ length: 100, nullable: true })
    returned_by: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    assigned_at: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    returned_at: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    acknowledged_at: Date;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @ManyToOne(() => Asset, asset => asset.assignments)
    @JoinColumn({ name: 'asset_id' })
    asset: Asset;

    @ManyToOne(() => Department, department => department.assignments)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @Column({ default: true })
    is_active: boolean;

    @Column({ length: 100, nullable: true })
    acknowledged_by: string;
}