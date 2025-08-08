"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
// Entities
const Department_1 = require("../entities/Department");
const Request_1 = require("../entities/Request");
const Approval_1 = require("../entities/Approval");
const Asset_1 = require("../entities/Asset");
const Assignment_1 = require("../entities/Assignment");
const Maintenance_1 = require("../entities/Maintenance");
const QrTag_1 = require("../entities/QrTag");
const AuditLog_1 = require("../entities/AuditLog");
const RequestItem_1 = require("../entities/RequestItem");
// Create and export the data source
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'assets',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [
        Department_1.Department,
        Request_1.Request,
        Approval_1.Approval,
        Asset_1.Asset,
        Assignment_1.Assignment,
        Maintenance_1.Maintenance,
        QrTag_1.QRTag,
        AuditLog_1.AuditLog,
        RequestItem_1.RequestItem
    ],
    migrations: [path_1.default.join(__dirname, '../migrations/*.{ts,js}')],
    subscribers: [],
});
