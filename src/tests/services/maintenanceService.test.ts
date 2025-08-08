import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AppDataSource } from '../../config/database';
import { Maintenance } from '../../entities/Maintenance';
import { Asset } from '../../entities/Asset';
import {
  scheduleMaintenance,
  getMaintenanceById,
  completeMaintenance
} from '../../services/maintenanceService';
import * as assetService from '../../services/assetService';
import { Repository, DeepPartial } from 'typeorm';

// Mock the database connection and asset service
jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('../../services/assetService', () => ({
  getAssetById: jest.fn(),
}));

// Define mock types
const mockAssetService = assetService as jest.Mocked<typeof assetService>;
const mockGetRepository = AppDataSource.getRepository as jest.Mock;

describe('Maintenance Service', () => {
  let mockRepository: jest.Mocked<Repository<Maintenance>>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock repository
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    } as any;

    mockGetRepository.mockReturnValue(mockRepository);
    mockAssetService.getAssetById.mockResolvedValue({ id: 'asset-id' } as Asset);
  });

  describe('scheduleMaintenance', () => {
    it('should schedule maintenance for an asset', async () => {
      // Arrange
      const assetId = 'asset-id';
      const maintenanceData = {
        maintenance_type: 'repair',
        description: 'Fix broken screen',
        scheduled_date: new Date(),
      };

      // Correctly type the mock implementation for save
      mockRepository.save.mockImplementation(
        (input: DeepPartial<Maintenance> | DeepPartial<Maintenance>[]): Promise<any> => {
          if (Array.isArray(input)) {
            return Promise.resolve(input.map((maintenance) => ({
              id: 'maintenance-id',
              ...maintenance,
              asset_id: 'asset-id',
              status: 'scheduled',
            })));
          } else {
            return Promise.resolve({
              id: 'maintenance-id',
              ...input,
              asset_id: 'asset-id',
              status: 'scheduled',
            });
          }
        }
      );

      // Act
      const result = await scheduleMaintenance(assetId, maintenanceData);

      // Assert
      expect(mockAssetService.getAssetById).toHaveBeenCalledWith(assetId);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.objectContaining({
        id: 'maintenance-id',
        asset_id: assetId,
        maintenance_type: 'repair',
        description: 'Fix broken screen',
        scheduled_date: maintenanceData.scheduled_date,
        status: 'scheduled',
      }));
    });
  });

  describe('getMaintenanceById', () => {
    it('should return the maintenance record with the specified ID', async () => {
      // Arrange
      const maintenanceId = 'maintenance-id';
      const mockMaintenance = {
        id: maintenanceId,
        asset_id: 'asset-id',
        maintenance_type: 'repair',
      } as Maintenance;
      mockRepository.findOne.mockResolvedValue(mockMaintenance);

      // Act
      const result = await getMaintenanceById(maintenanceId);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: maintenanceId },
        relations: ['asset'],
      });
      expect(result).toEqual(mockMaintenance);
    });

    it('should throw an error if the maintenance record is not found', async () => {
      // Arrange
      const maintenanceId = 'non-existent-id';
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(getMaintenanceById(maintenanceId)).rejects.toThrow(
        `Maintenance record with ID ${maintenanceId} not found`
      );
    });
  });

  describe('completeMaintenance', () => {
    it('should mark maintenance as completed', async () => {
      // Arrange
      const maintenanceId = 'maintenance-id';
      const completionData = {
        completion_date: new Date(),
        technician_id: 'tech-123',
        notes: 'Replaced screen',
      };

      const mockMaintenance = new Maintenance();
      mockMaintenance.id = maintenanceId;
      mockMaintenance.status = 'scheduled';

      mockRepository.findOne.mockResolvedValue(mockMaintenance);
      mockRepository.save.mockImplementation(
        (input: any, options?: any) => {
          if (Array.isArray(input)) {
            return Promise.resolve(input);
          } else {
            return Promise.resolve(input);
          }
        }
      );

      // Act
      const result = await completeMaintenance(maintenanceId, completionData);

      // Assert
      expect(result.status).toBe('completed');
      expect(result.completed_date).toEqual(completionData.completion_date);
      expect(result.performed_by).toBe(completionData.technician_id);
      expect(result.notes).toBe(completionData.notes);
    });
  });
});