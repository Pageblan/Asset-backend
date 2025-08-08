import { Request, Response } from 'express';
import { 
    createAsset, 
    getAssetById, 
    getAssetByAssetId, 
    getAllAssets, 
    updateAsset, 
    disposeAsset,
    calculateDepreciation
} from '../services/assetService';
import { Asset } from '../entities/Asset';

/**
 * Create a new asset
 * @param req Request
 * @param res Response
 */
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const assetData: Partial<Asset> = req.body;
        const asset = await createAsset(assetData);
        res.status(201).json(asset);
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({ 
            message: 'Failed to create asset', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.1'
        });
    }
};

/**
 * Get asset by ID
 * @param req Request
 * @param res Response
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const asset = await getAssetById(id);
        res.status(200).json(asset);
    } catch (error) {
        console.error('Error getting asset:', error);
        res.status(404).json({ 
            message: 'Asset not found', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.2'
        });
    }
};

/**
 * Get asset by asset_id (formatted ID)
 * @param req Request
 * @param res Response
 */
export const getByAssetId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assetId } = req.params;
        const asset = await getAssetByAssetId(assetId);
        res.status(200).json(asset);
    } catch (error) {
        console.error('Error getting asset:', error);
        res.status(404).json({ 
            message: 'Asset not found', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.3'
        });
    }
};

/**
 * Get all assets with optional filtering
 * @param req Request
 * @param res Response
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const filters = req.query as Partial<Asset>;
        const assets = await getAllAssets(filters);
        res.status(200).json(assets);
    } catch (error) {
        console.error('Error getting assets:', error);
        res.status(500).json({ 
            message: 'Failed to get assets', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.4'
        });
    }
};

/**
 * Update asset
 * @param req Request
 * @param res Response
 */
export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const assetData: Partial<Asset> = req.body;
        const asset = await updateAsset(id, assetData);
        res.status(200).json(asset);
    } catch (error) {
        console.error('Error updating asset:', error);
        res.status(500).json({ 
            message: 'Failed to update asset', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.5'
        });
    }
};

/**
 * Dispose asset
 * @param req Request
 * @param res Response
 */
export const dispose = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { disposalDate, notes } = req.body;
        const asset = await disposeAsset(id, new Date(disposalDate), notes);
        res.status(200).json(asset);
    } catch (error) {
        console.error('Error disposing asset:', error);
        res.status(500).json({ 
            message: 'Failed to dispose asset', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.6'
        });
    }
};

/**
 * Calculate depreciation for an asset
 * @param req Request
 * @param res Response
 */
export const recalculateDepreciation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const asset = await getAssetById(id);
        const updatedAsset = await calculateDepreciation(asset);
        res.status(200).json(updatedAsset);
    } catch (error) {
        console.error('Error calculating depreciation:', error);
        res.status(500).json({ 
            message: 'Failed to calculate depreciation', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.7'
        });
    }
};
