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
exports.Asset = exports.AssetStatus = void 0;
const typeorm_1 = require("typeorm");
const QrTag_1 = require("../entities/QrTag");
const Maintenance_1 = require("../entities/Maintenance");
const Assignment_1 = require("../entities/Assignment");
const RequestItem_1 = require("../entities/RequestItem");
var AssetStatus;
(function (AssetStatus) {
    AssetStatus["AVAILABLE"] = "AVAILABLE";
    AssetStatus["ASSIGNED"] = "ASSIGNED";
    AssetStatus["MAINTENANCE"] = "MAINTENANCE";
    AssetStatus["DISPOSED"] = "DISPOSED";
})(AssetStatus || (exports.AssetStatus = AssetStatus = {}));
let Asset = class Asset {
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Asset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: false, unique: true }),
    __metadata("design:type", String)
], Asset.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: false }),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "serial_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Asset.prototype, "initial_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Asset.prototype, "current_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Asset.prototype, "purchase_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Asset.prototype, "expected_lifetime_years", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssetStatus,
        default: AssetStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], Asset.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Asset.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Asset.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => QrTag_1.QRTag, (qrTag) => qrTag.asset),
    __metadata("design:type", QrTag_1.QRTag)
], Asset.prototype, "qr_tag", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Maintenance_1.Maintenance, (maintenance) => maintenance.asset),
    __metadata("design:type", Array)
], Asset.prototype, "maintenance_records", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Assignment_1.Assignment, (assignment) => assignment.asset),
    __metadata("design:type", Array)
], Asset.prototype, "assignments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RequestItem_1.RequestItem, (requestItem) => requestItem.asset),
    __metadata("design:type", Array)
], Asset.prototype, "request_items", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)('assets')
], Asset);
