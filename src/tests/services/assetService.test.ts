import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AppDataSource } from '../../config/database';
import { Asset } from '../../entities/Asset';
import { createAsset, getAssetById, calculateDepreciation } from '../../services/assetService';

// Mock the database connection
jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('Asset Service', () => {
  let mockRepository: any;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup mock repository
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });
  
  describe('createAsset', () => {
    it('should create a new asset with the provided data', async () => {
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
        date_received: expect.any(Date),
      });
      
      // Act
      const result = await createAsset(assetData);
      
      // Assert
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.objectContaining({
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
  
  describe('getAssetById', () => {
    it('should return the asset with the specified ID', async () => {
      // Arrange
      const assetId = 'test-uuid';
      const mockAsset = {
        id: assetId,
        asset_id: 'ASSET-001',
        name: 'Test Asset',
      };
      
      mockRepository.findOne.mockResolvedValue(mockAsset);
      
      // Act
      const result = await getAssetById(assetId);
      
      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: assetId },
        relations: ['qr_tag', 'maintenance_records', 'assignments'],
      });
      expect(result).toEqual(mockAsset);
    });
    
    it('should throw an error if the asset is not found', async () => {
      // Arrange
      const assetId = 'non-existent-id';
      mockRepository.findOne.mockResolvedValue(null);
      
      // Act & Assert
      await expect(getAssetById(assetId)).rejects.toThrow(
        `Asset with ID ${assetId} not found`
      );
    });
  });
  
  describe('calculateDepreciation', () => {
    it('should calculate depreciation correctly', async () => {
      // Arrange
      const asset = new Asset();
      asset.initial_value = 1000;
      asset.date_received = new Date(new Date().setFullYear(new Date().getFullYear() - 2)); // 2 years ago
      asset.depreciation_years = 5;
      
      mockRepository.save.mockImplementation((a: Asset) => Promise.resolve(a));
      
      // Act
      const result = await calculateDepreciation(asset);
      
      // Assert
      expect(result.current_value).toBeCloseTo(600, 0); // 1000 - (1000 * (2/5))
      expect(mockRepository.save).toHaveBeenCalledWith(asset);
    });
    
    it('should not depreciate disposed assets', async () => {
      // Arrange
      const asset = new Asset();
      asset.initial_value = 1000;
      asset.current_value = 800;
      asset.date_received = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      asset.date_disposed = new Date();
      asset.depreciation_years = 5;
      
      // Act
      const result = await calculateDepreciation(asset);
      
      // Assert
      expect(result.current_value).toBe(800); // No change
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});