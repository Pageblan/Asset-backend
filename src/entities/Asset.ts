// src/entities/Asset.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { Department } from './Department';
  import { Assignment } from './Assignment';
  import { Maintenance } from './Maintenance';
  import { QRTag } from './QrTag';
  import { RequestItem } from './RequestItem';
  
  @Entity('assets')
  export class Asset {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ length: 50, unique: true })
    asset_id!: string;
  
    @Column({ length: 100 })
    name!: string;
  
    @Column({ length: 100, nullable: true })
    model!: string;
  
    @Column({ length: 100, nullable: true })
    serial_number!: string;
    
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    initial_value!: number;
    
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    current_value!: number;
    
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salvage_value?: number;
    
    @Column({ type: 'date', nullable: true })
    date_received!: Date;
    
    @Column({ type: 'integer', default: 5 })
    depreciation_years!: number;
    
    @Column({ type: 'text', nullable: true })
    notes?: string | null;
    
    @Column({ type: 'date', nullable: true })
    date_disposed!: Date;
    
    @Column({ length: 50, default: 'available' })
    status!: string;
    
    @Column({ length: 50, nullable: true })
    depreciation_method?: string;
  
    @ManyToOne(() => Department, (d) => d.assets)
    @JoinColumn({ name: 'department_id' })
    department!: Department;
  
    @OneToMany(() => Assignment, (a) => a.asset)
    assignments!: Assignment[];
  
    @OneToMany(() => Maintenance, (m) => m.asset)
    maintenances!: Maintenance[];
  
    @OneToMany(() => QRTag, (q) => q.asset)
    qrTags!: QRTag[];
    
    @OneToMany(() => RequestItem, (ri) => ri.asset)
    request_items!: RequestItem[];
  
    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at!: Date;
  
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at!: Date;
  }
  