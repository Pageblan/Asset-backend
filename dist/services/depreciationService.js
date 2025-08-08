"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDepreciationJob = exports.calculateDepreciation = exports.calculateDecliningBalanceDepreciation = exports.calculateStraightLineDepreciation = void 0;
const database_1 = require("../config/database");
const Asset_1 = require("../entities/Asset");
const typeorm_1 = require("typeorm"); // ← import IsNull
/**
 * Calculate depreciation for an asset using straight-line method
 */
const calculateStraightLineDepreciation = async (asset) => {
    const repo = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Skip if asset is disposed
    if (asset.date_disposed) {
        return asset;
    }
    const today = new Date();
    const receivedDate = new Date(asset.date_received);
    const yearsSince = (today.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const rate = 1 / asset.depreciation_years;
    const totalDepreciation = Math.min(yearsSince * rate, 1);
    asset.current_value = asset.initial_value * (1 - totalDepreciation);
    return await repo.save(asset);
};
exports.calculateStraightLineDepreciation = calculateStraightLineDepreciation;
/**
 * Calculate depreciation for an asset using declining balance method
 */
const calculateDecliningBalanceDepreciation = async (asset, rate = 2) => {
    var _a;
    const repo = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Skip if asset is disposed
    if (asset.date_disposed) {
        return asset;
    }
    const today = new Date();
    const receivedDate = new Date(asset.date_received);
    const yearsSince = (today.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const annualRate = rate / asset.depreciation_years;
    let currentValue = asset.initial_value;
    // Full years
    for (let i = 0; i < Math.floor(yearsSince); i++) {
        currentValue *= (1 - annualRate);
    }
    // Partial year
    const partial = yearsSince - Math.floor(yearsSince);
    if (partial > 0) {
        currentValue *= (1 - annualRate * partial);
    }
    const salvage = (_a = asset.salvage_value) !== null && _a !== void 0 ? _a : (asset.initial_value * 0.1);
    asset.current_value = Math.max(currentValue, salvage);
    return await repo.save(asset);
};
exports.calculateDecliningBalanceDepreciation = calculateDecliningBalanceDepreciation;
/**
 * Dispatch to the correct depreciation method
 */
const calculateDepreciation = async (asset) => {
    if (asset.depreciation_method === 'declining-balance') {
        return (0, exports.calculateDecliningBalanceDepreciation)(asset);
    }
    return (0, exports.calculateStraightLineDepreciation)(asset);
};
exports.calculateDepreciation = calculateDepreciation;
/**
 * Run depreciation calculation for all assets.
 * Should be scheduled e.g. via cron or a job runner.
 */
const runDepreciationJob = async () => {
    const repo = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Now uses IsNull() for the nullable date_disposed field
    const assets = await repo.find({
        where: {
            status: 'available',
            date_disposed: (0, typeorm_1.IsNull)()
        }
    });
    for (const asset of assets) {
        await (0, exports.calculateDepreciation)(asset);
    }
    console.log(`Depreciation calculated for ${assets.length} assets`);
};
exports.runDepreciationJob = runDepreciationJob;
