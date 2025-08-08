import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Asset } from './Asset';

@Entity('qr_tags')
export class QRTag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    asset_id: string;

    @Column({ type: 'text' })
    qr_data: string;

    @Column({ length: 255 })
    qr_image_path: string;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @OneToOne(() => Asset, asset => asset.qrTags)
    @JoinColumn({ name: 'asset_id' })
    asset: Asset;
}