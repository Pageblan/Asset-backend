import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import entities
import { Department } from './src/entities/Department';
import { Request } from './src/entities/Request';
import { Approval } from './src/entities/Approval';
import { Asset } from './src/entities/Asset';
import { Assignment } from './src/entities/Assignment';
import { Maintenance } from './src/entities/Maintenance';
import { QRTag } from './src/entities/QrTag';
import { AuditLog } from './src/entities/AuditLog';
import { RequestItem } from './src/entities/RequestItem';

// Create and export the data source
export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'admin_admin',
    password: process.env.DB_PASSWORD || 'pass_password',
    database: process.env.DB_NAME || 'name_assets',
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
        RequestItem
    ],
    migrations: [path.join(__dirname, './src/migrations/*.{ts,js}')],
    subscribers: [],
});