import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Request } from './Request';
import { Asset } from './Asset';

@Entity('request_items')
export class RequestItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    request_id: string;

    @Column({ nullable: true })
    asset_id: string;

    @Column({ length: 50, nullable: true })
    asset_category: string;

    @Column({ default: 1 })
    quantity: number;

    @Column({ length: 20, default: 'PENDING' })
    status: string;

    @ManyToOne(() => Request, request => request.items)
    @JoinColumn({ name: 'request_id' })
    request: Request;

    @ManyToOne(() => Asset, asset => asset.request_items, { nullable: true })
    @JoinColumn({ name: 'asset_id' })
    asset: Asset;
}
