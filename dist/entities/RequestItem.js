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
exports.RequestItem = void 0;
const typeorm_1 = require("typeorm");
const Request_1 = require("./Request");
const Asset_1 = require("./Asset");
let RequestItem = class RequestItem {
};
exports.RequestItem = RequestItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RequestItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RequestItem.prototype, "request_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestItem.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], RequestItem.prototype, "asset_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], RequestItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'PENDING' }),
    __metadata("design:type", String)
], RequestItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Request_1.Request, request => request.items),
    (0, typeorm_1.JoinColumn)({ name: 'request_id' }),
    __metadata("design:type", Request_1.Request)
], RequestItem.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Asset_1.Asset, asset => asset.request_items, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", Asset_1.Asset)
], RequestItem.prototype, "asset", void 0);
exports.RequestItem = RequestItem = __decorate([
    (0, typeorm_1.Entity)('request_items')
], RequestItem);
