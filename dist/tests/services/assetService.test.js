"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const database_1 = require("../../config/database");
const Asset_1 = require("../../entities/Asset");
const assetService_1 = require("../../services/assetService");
// Mock the database connection
globals_1.jest.mock('../../config/database', () => ({
    AppDataSource: {
        getRepository: globals_1.jest.fn(),
    },
}));
(0, globals_1.describe)('Asset Service', () => {
    let mockRepository;
    (0, globals_1.beforeEach)(() => {
        // Reset mocks before each test
        globals_1.jest.clearAllMocks();
        // Setup mock repository
        mockRepository = {
            findOne: globals_1.jest.fn(),
            save: globals_1.jest.fn(),
            find: globals_1.jest.fn(),
        };
        database_1.AppDataSource.getRepository.mockReturnValue(mockRepository);
    });
    (0, globals_1.describe)('createAsset', () => {
        (0, globals_1.it)('should create a new asset with the provided data', async () => {
            // Arrange
            const assetData = {
                name: 'Test Asset',
                model: 'Test Model',
                serial_number: '123456',
                initial_value: 1000,
                depreciation_years: 5,
            };
            mockRepository.save.mockResolvedValue({
                id: 'test-uuid',
                asset_id: 'ASSET-001',
                ...assetData,
                current_value: 1000,
                date_received: globals_1.expect.any(Date),
            });
            // Act
            const result = await (0, assetService_1.createAsset)(assetData);
            // Assert
            (0, globals_1.expect)(mockRepository.save).toHaveBeenCalledTimes(1);
            (0, globals_1.expect)(result).toEqual(globals_1.expect.objectContaining({
                id: 'test-uuid',
                asset_id: 'ASSET-001',
                name: 'Test Asset',
                model: 'Test Model',
                serial_number: '123456',
                initial_value: 1000,
                current_value: 1000,
                depreciation_years: 5,
            }));
        });
    });
    (0, globals_1.describe)('getAssetById', () => {
        (0, globals_1.it)('should return the asset with the specified ID', async () => {
            // Arrange
            const assetId = 'test-uuid';
            const mockAsset = {
                id: assetId,
                asset_id: 'ASSET-001',
                name: 'Test Asset',
            };
            mockRepository.findOne.mockResolvedValue(mockAsset);
            // Act
            const result = await (0, assetService_1.getAssetById)(assetId);
            // Assert
            (0, globals_1.expect)(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: assetId },
                relations: ['qr_tag', 'maintenance_records', 'assignments'],
            });
            (0, globals_1.expect)(result).toEqual(mockAsset);
        });
        (0, globals_1.it)('should throw an error if the asset is not found', async () => {
            // Arrange
            const assetId = 'non-existent-id';
            mockRepository.findOne.mockResolvedValue(null);
            // Act & Assert
            await (0, globals_1.expect)((0, assetService_1.getAssetById)(assetId)).rejects.toThrow(`Asset with ID ${assetId} not found`);
        });
    });
    (0, globals_1.describe)('calculateDepreciation', () => {
        (0, globals_1.it)('should calculate depreciation correctly', async () => {
            // Arrange
            const asset = new Asset_1.Asset();
            asset.initial_value = 1000;
            asset.date_received = new Date(new Date().setFullYear(new Date().getFullYear() - 2)); // 2 years ago
            asset.depreciation_years = 5;
            mockRepository.save.mockImplementation((a) => Promise.resolve(a));
            // Act
            const result = await (0, assetService_1.calculateDepreciation)(asset);
            // Assert
            (0, globals_1.expect)(result.current_value).toBeCloseTo(600, 0); // 1000 - (1000 * (2/5))
            (0, globals_1.expect)(mockRepository.save).toHaveBeenCalledWith(asset);
        });
        (0, globals_1.it)('should not depreciate disposed assets', async () => {
            // Arrange
            const asset = new Asset_1.Asset();
            asset.initial_value = 1000;
            asset.current_value = 800;
            asset.date_received = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
            asset.date_disposed = new Date();
            asset.depreciation_years = 5;
            // Act
            const result = await (0, assetService_1.calculateDepreciation)(asset);
            // Assert
            (0, globals_1.expect)(result.current_value).toBe(800); // No change
            (0, globals_1.expect)(mockRepository.save).not.toHaveBeenCalled();
        });
    });
});
