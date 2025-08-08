"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
// src/entities/Asset.ts
const typeorm_1 = require("typeorm");
const Department_1 = require("./Department");
const Assignment_1 = require("./Assignment");
const Maintenance_1 = require("./Maintenance");
const QrTag_1 = require("./QrTag");
const RequestItem_1 = require("./RequestItem");
let Asset = class Asset {
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Asset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], Asset.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "serial_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Asset.prototype, "initial_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Asset.prototype, "current_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Asset.prototype, "salvage_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Asset.prototype, "date_received", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 5 }),
    __metadata("design:type", Number)
], Asset.prototype, "depreciation_years", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Asset.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Asset.prototype, "date_disposed", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'available' }),
    __metadata("design:type", String)
], Asset.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "depreciation_method", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Department_1.Department, (d) => d.assets),
    (0, typeorm_1.JoinColumn)({ name: 'department_id' }),
    __metadata("design:type", Department_1.Department)
], Asset.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Assignment_1.Assignment, (a) => a.asset),
    __metadata("design:type", Array)
], Asset.prototype, "assignments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Maintenance_1.Maintenance, (m) => m.asset),
    __metadata("design:type", Array)
], Asset.prototype, "maintenances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => QrTag_1.QRTag, (q) => q.asset),
    __metadata("design:type", Array)
], Asset.prototype, "qrTags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RequestItem_1.RequestItem, (ri) => ri.asset),
    __metadata("design:type", Array)
], Asset.prototype, "request_items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Asset.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Asset.prototype, "updated_at", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)('assets')
], Asset);
