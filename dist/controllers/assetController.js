"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculateDepreciation = exports.dispose = exports.update = exports.getAll = exports.getByAssetId = exports.getById = exports.create = void 0;
const assetService_1 = require("../services/assetService");
/**
 * Create a new asset
 * @param req Request
 * @param res Response
 */
const create = async (req, res) => {
    try {
        const assetData = req.body;
        const asset = await (0, assetService_1.createAsset)(assetData);
        res.status(201).json(asset);
    }
    catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({
            message: 'Failed to create asset',
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.1'
        });
    }
};
exports.create = create;
/**
 * Get asset by ID
 * @param req Request
 * @param res Response
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await (0, assetService_1.getAssetById)(id);
        res.status(200).json(asset);
    }
    catch (error) {
        console.error('Error getting asset:', error);
        res.status(404).json({
            message: 'Asset not found',
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.2'
        });
    }
};
exports.getById = getById;
/**
 * Get asset by asset_id (formatted ID)
 * @param req Request
 * @param res Response
 */
const getByAssetId = async (req, res) => {
    try {
        const { assetId } = req.params;
        const asset = await (0, assetService_1.getAssetByAssetId)(assetId);
        res.status(200).json(asset);
    }
    catch (error) {
        console.error('Error getting asset:', error);
        res.status(404).json({
            message: 'Asset not found',
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.3'
        });
    }
};
exports.getByAssetId = getByAssetId;
/**
 * Get all assets with optional filtering
 * @param req Request
 * @param res Response
 */
const getAll = async (req, res) => {
    try {
        const filters = req.query;
        const assets = await (0, assetService_1.getAllAssets)(filters);
        res.status(200).json(assets);
    }
    catch (error) {
        console.error('Error getting assets:', error);
        res.status(500).json({
            message: 'Failed to get assets',
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.4'
        });
    }
};
exports.getAll = getAll;
/**
 * Update asset
 * @param req Request
 * @param res Response
 */
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const assetData = req.body;
        const asset = await (0, assetService_1.updateAsset)(id, assetData);
        res.status(200).json(asset);
    }
    catch (error) {
        console.error('Error updating asset:', error);
        res.status(500).json({
            message: 'Failed to update asset',
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.5'
        });
    }
};
exports.update = update;
/**
 * Dispose asset
 * @param req Request
 * @param res Response
 */
const dispose = async (req, res) => {
    try {
        const { id } = req.params;
        const { disposalDate, notes } = req.body;
        const asset = await (0, assetService_1.disposeAsset)(id, new Date(disposalDate), notes);
        res.status(200).json(asset);
    }
    catch (error) {
        console.error('Error disposing asset:', error);
        res.status(500).json({
            message: 'Failed to dispose asset',
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.6'
        });
    }
};
exports.dispose = dispose;
/**
 * Calculate depreciation for an asset
 * @param req Request
 * @param res Response
 */
const recalculateDepreciation = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await (0, assetService_1.getAssetById)(id);
        const updatedAsset = await (0, assetService_1.calculateDepreciation)(asset);
        res.status(200).json(updatedAsset);
    }
    catch (error) {
        console.error('Error calculating depreciation:', error);
        res.status(500).json({
            message: 'Failed to calculate depreciation',
            error: error instanceof Error ? error.message : 'An unknown error occurred 1.7'
        });
    }
};
exports.recalculateDepreciation = recalculateDepreciation;
