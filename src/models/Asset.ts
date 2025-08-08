import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { QRTag as QrTag } from '../entities/QrTag';
import { Maintenance } from '../entities/Maintenance';
import { Assignment } from '../entities/Assignment';
import { RequestItem } from '../entities/RequestItem';

export enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  MAINTENANCE = 'MAINTENANCE',
  DISPOSED = 'DISPOSED',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false, unique: true })
  asset_id: string;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 255, nullable: true })
  model: string;

  @Column({ length: 255, nullable: true })
  serial_number: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  initial_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  current_value: number;

  @Column({ type: 'date', nullable: true })
  purchase_date: Date;

  @Column({ type: 'integer', nullable: true })
  expected_lifetime_years: number;

  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.AVAILABLE,
  })
  status: AssetStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToOne(() => QrTag, (qrTag) => qrTag.asset)
  qr_tag: QrTag;

  @OneToMany(() => Maintenance, (maintenance) => maintenance.asset)
  maintenance_records: Maintenance[];

  @OneToMany(() => Assignment, (assignment) => assignment.asset)
  assignments: Assignment[];

  @OneToMany(() => RequestItem, (requestItem) => requestItem.asset)
  request_items: RequestItem[];
}