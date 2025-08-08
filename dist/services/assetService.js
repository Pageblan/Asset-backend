"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDepreciationJob = exports.disposeAsset = exports.getAllAssets = exports.updateAsset = exports.getAssetByAssetId = exports.getAssetById = exports.calculateDepreciation = exports.createAsset = exports.generateAssetId = void 0;
const database_1 = require("../config/database");
const Asset_1 = require("../entities/Asset");
const qrCodeService_1 = require("./qrCodeService");
/**
 * Generate a unique asset ID
 * @returns Unique asset ID
 */
const generateAssetId = async () => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Get current year
    const year = new Date().getFullYear().toString().substr(-2);
    // Get count of assets created this year
    const countQuery = `
        SELECT COUNT(*) as count 
        FROM assets 
        WHERE asset_id LIKE '${year}-%'
    `;
    const result = await assetRepository.query(countQuery);
    const count = parseInt(result[0].count) + 1;
    // Format: YY-XXXXX (e.g., 23-00001)
    const assetId = `${year}-${count.toString().padStart(5, '0')}`;
    return assetId;
};
exports.generateAssetId = generateAssetId;
/**
 * Create a new asset
 * @param assetData Asset data
 * @returns Created asset
 */
const createAsset = async (assetData) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Generate asset ID
    const assetId = await (0, exports.generateAssetId)();
    // Create asset
    const asset = new Asset_1.Asset();
    asset.asset_id = assetId;
    asset.name = assetData.name || 'Unnamed Asset';
    asset.model = assetData.model || 'Unknown Model';
    asset.serial_number = assetData.serial_number || 'N/A';
    asset.initial_value = assetData.initial_value || 0;
    asset.current_value = assetData.initial_value || 0; // Initially same as initial value
    asset.date_received = assetData.date_received || new Date();
    asset.depreciation_years = assetData.depreciation_years || 5;
    asset.notes = assetData.notes || null;
    // Save asset
    const savedAsset = await assetRepository.save(asset);
    // Generate QR code
    await (0, qrCodeService_1.generateQRCode)(savedAsset.id);
    return savedAsset;
};
exports.createAsset = createAsset;
/**
 * Calculate depreciation for an asset
 * @param asset Asset
 * @returns Updated asset with new current value
 */
const calculateDepreciation = async (asset) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Skip if asset is disposed
    if (asset.date_disposed) {
        return asset;
    }
    // Calculate years since received
    const today = new Date();
    const receivedDate = new Date(asset.date_received);
    const yearsSinceReceived = (today.getTime() - receivedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    // Calculate depreciation
    const depreciationRate = 1 / asset.depreciation_years;
    const totalDepreciation = Math.min(yearsSinceReceived * depreciationRate, 1); // Cap at 100%
    // Update current value
    asset.current_value = asset.initial_value * (1 - totalDepreciation);
    // Save updated asset
    return await assetRepository.save(asset);
};
exports.calculateDepreciation = calculateDepreciation;
/**
 * Get asset by ID
 * @param id Asset ID
 * @returns Asset
 */
const getAssetById = async (id) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    const asset = await assetRepository.findOne({
        where: { id },
        relations: ['qr_tag', 'maintenance_records', 'assignments']
    });
    if (!asset) {
        throw new Error(`Asset with ID ${id} not found`);
    }
    return asset;
};
exports.getAssetById = getAssetById;
/**
 * Get asset by asset_id
 * @param assetId Asset ID (formatted ID)
 * @returns Asset
 */
const getAssetByAssetId = async (assetId) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    const asset = await assetRepository.findOne({
        where: { asset_id: assetId },
        relations: ['qr_tag', 'maintenance_records', 'assignments']
    });
    if (!asset) {
        throw new Error(`Asset with asset_id ${assetId} not found`);
    }
    return asset;
};
exports.getAssetByAssetId = getAssetByAssetId;
/**
 * Update asset
 * @param id Asset ID
 * @param assetData Asset data to update
 * @returns Updated asset
 */
const updateAsset = async (id, assetData) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    const asset = await (0, exports.getAssetById)(id);
    // Update fields
    Object.assign(asset, assetData);
    // Save updated asset
    return await assetRepository.save(asset);
};
exports.updateAsset = updateAsset;
/**
 * Get all assets with optional filtering
 * @param filters Optional filters
 * @returns List of assets
 */
const getAllAssets = async (filters) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Build query
    const queryBuilder = assetRepository.createQueryBuilder('asset')
        .leftJoinAndSelect('asset.qr_tag', 'qr_tag')
        .leftJoinAndSelect('asset.maintenance_records', 'maintenance')
        .leftJoinAndSelect('asset.assignments', 'assignment');
    // Apply filters if provided
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                queryBuilder.andWhere(`asset.${key} = :${key}`, { [key]: value });
            }
        });
    }
    // Execute query
    return await queryBuilder.getMany();
};
exports.getAllAssets = getAllAssets;
/**
 * Dispose an asset
 * @param id Asset ID
 * @param disposalDate Date of disposal
 * @param notes Disposal notes
 * @returns Updated asset
 */
const disposeAsset = async (id, disposalDate, notes) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    const asset = await (0, exports.getAssetById)(id);
    // Update asset
    asset.status = 'disposed';
    asset.date_disposed = disposalDate;
    if (notes) {
        asset.notes = asset.notes ? `${asset.notes}\n\nDisposal: ${notes}` : `Disposal: ${notes}`;
    }
    // Save updated asset
    return await assetRepository.save(asset);
};
exports.disposeAsset = disposeAsset;
/**
 * Run depreciation calculation for all assets
 * This should be scheduled to run periodically
 */
const runDepreciationJob = async () => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    const assets = await assetRepository.find({
        where: { status: 'available' }
    });
    // Calculate depreciation for each asset
    for (const asset of assets) {
        await (0, exports.calculateDepreciation)(asset);
    }
    console.log(`Depreciation calculated for ${assets.length} assets`);
};
exports.runDepreciationJob = runDepreciationJob;
