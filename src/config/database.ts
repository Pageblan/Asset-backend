import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Entities
import { Department } from '../entities/Department';
import { Request } from '../entities/Request';
import { Approval } from '../entities/Approval';
import { Asset } from '../entities/Asset';
import { Assignment } from '../entities/Assignment';
import { Maintenance } from '../entities/Maintenance';
import { QRTag } from '../entities/QrTag';
import { AuditLog } from '../entities/AuditLog';
import { AuditTrail } from '../entities/AuditTrail';
import { RequestItem } from '../entities/RequestItem';

// Create and export the data source
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'assets',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [
        Department,
        Request,
        Approval,
        Asset,
        Assignment,
        Maintenance,
        QRTag,
        AuditLog,
        AuditTrail,
        RequestItem
    ],
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
    subscribers: [],
});