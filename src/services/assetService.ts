import { AppDataSource } from '../config/database';
import { Asset } from '../entities/Asset';
import { generateQRCode } from './qrCodeService';

/**
 * Generate a unique asset ID
 * @returns Unique asset ID
 */
export const generateAssetId = async (): Promise<string> => {
    const assetRepository = AppDataSource.getRepository(Asset);
    
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

/**
 * Create a new asset
 * @param assetData Asset data
 * @returns Created asset
 */
export const createAsset = async (assetData: Partial<Asset>): Promise<Asset> => {
    const assetRepository = AppDataSource.getRepository(Asset);
    
    // Generate asset ID
    const assetId = await generateAssetId();
    
    // Create asset
    const asset = new Asset();
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
    await generateQRCode(savedAsset.id);
    
    return savedAsset;
};

/**
 * Calculate depreciation for an asset
 * @param asset Asset
 * @returns Updated asset with new current value
 */
export const calculateDepreciation = async (asset: Asset): Promise<Asset> => {
    const assetRepository = AppDataSource.getRepository(Asset);
    
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

/**
 * Get asset by ID
 * @param id Asset ID
 * @returns Asset
 */
export const getAssetById = async (id: string): Promise<Asset> => {
    const assetRepository = AppDataSource.getRepository(Asset);
    const asset = await assetRepository.findOne({
        where: { id },
        relations: ['qr_tag', 'maintenance_records', 'assignments']
    });
    
    if (!asset) {
        throw new Error(`Asset with ID ${id} not found`);
    }
    
    return asset;
};

/**
 * Get asset by asset_id
 * @param assetId Asset ID (formatted ID)
 * @returns Asset
 */
export const getAssetByAssetId = async (assetId: string): Promise<Asset> => {
    const assetRepository = AppDataSource.getRepository(Asset);
    const asset = await assetRepository.findOne({
        where: { asset_id: assetId },
        relations: ['qr_tag', 'maintenance_records', 'assignments']
    });
    
    if (!asset) {
        throw new Error(`Asset with asset_id ${assetId} not found`);
    }
    
    return asset;
};

/**
 * Update asset
 * @param id Asset ID
 * @param assetData Asset data to update
 * @returns Updated asset
 */
export const updateAsset = async (id: string, assetData: Partial<Asset>): Promise<Asset> => {
    const assetRepository = AppDataSource.getRepository(Asset);
    const asset = await getAssetById(id);
    
    // Update fields
    Object.assign(asset, assetData);
    
    // Save updated asset
    return await assetRepository.save(asset);
};

/**
 * Get all assets with optional filtering
 * @param filters Optional filters
 * @returns List of assets
 */
export const getAllAssets = async (filters?: Partial<Asset>): Promise<Asset[]> => {
    const assetRepository = AppDataSource.getRepository(Asset);
    
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

/**
 * Dispose an asset
 * @param id Asset ID
 * @param disposalDate Date of disposal
 * @param notes Disposal notes
 * @returns Updated asset
 */
export const disposeAsset = async (id: string, disposalDate: Date, notes?: string): Promise<Asset> => {
    const assetRepository = AppDataSource.getRepository(Asset);
    const asset = await getAssetById(id);
    
    // Update asset
    asset.status = 'disposed';
    asset.date_disposed = disposalDate;
    if (notes) {
        asset.notes = asset.notes ? `${asset.notes}\n\nDisposal: ${notes}` : `Disposal: ${notes}`;
    }
    
    // Save updated asset
    return await assetRepository.save(asset);
};

/**
 * Run depreciation calculation for all assets
 * This should be scheduled to run periodically
 */
export const runDepreciationJob = async (): Promise<void> => {
    const assetRepository = AppDataSource.getRepository(Asset);
    const assets = await assetRepository.find({
        where: { status: 'available' }
    });
    
    // Calculate depreciation for each asset
    for (const asset of assets) {
        await calculateDepreciation(asset);
    }
    
    console.log(`Depreciation calculated for ${assets.length} assets`);
};