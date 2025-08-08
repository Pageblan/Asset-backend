"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const database_1 = require("../../config/database");
const Maintenance_1 = require("../../entities/Maintenance");
const maintenanceService_1 = require("../../services/maintenanceService");
const assetService = __importStar(require("../../services/assetService"));
// Mock the database connection and asset service
globals_1.jest.mock('../../config/database', () => ({
    AppDataSource: {
        getRepository: globals_1.jest.fn(),
    },
}));
globals_1.jest.mock('../../services/assetService', () => ({
    getAssetById: globals_1.jest.fn(),
}));
// Define mock types
const mockAssetService = assetService;
const mockGetRepository = database_1.AppDataSource.getRepository;
(0, globals_1.describe)('Maintenance Service', () => {
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
        mockGetRepository.mockReturnValue(mockRepository);
        mockAssetService.getAssetById.mockResolvedValue({ id: 'asset-id' });
    });
    (0, globals_1.describe)('scheduleMaintenance', () => {
        (0, globals_1.it)('should schedule maintenance for an asset', async () => {
            // Arrange
            const assetId = 'asset-id';
            const maintenanceData = {
                maintenance_type: 'repair',
                description: 'Fix broken screen',
                scheduled_date: new Date(),
            };
            // Correctly type the mock implementation for save
            mockRepository.save.mockImplementation((input) => {
                if (Array.isArray(input)) {
                    return Promise.resolve(input.map((maintenance) => ({
                        id: 'maintenance-id',
                        ...maintenance,
                        asset_id: 'asset-id',
                        status: 'scheduled',
                    })));
                }
                else {
                    return Promise.resolve({
                        id: 'maintenance-id',
                        ...input,
                        asset_id: 'asset-id',
                        status: 'scheduled',
                    });
                }
            });
            // Act
            const result = await (0, maintenanceService_1.scheduleMaintenance)(assetId, maintenanceData);
            // Assert
            (0, globals_1.expect)(mockAssetService.getAssetById).toHaveBeenCalledWith(assetId);
            (0, globals_1.expect)(mockRepository.save).toHaveBeenCalledTimes(1);
            (0, globals_1.expect)(result).toEqual(globals_1.expect.objectContaining({
                id: 'maintenance-id',
                asset_id: assetId,
                maintenance_type: 'repair',
                description: 'Fix broken screen',
                scheduled_date: maintenanceData.scheduled_date,
                status: 'scheduled',
            }));
        });
    });
    (0, globals_1.describe)('getMaintenanceById', () => {
        (0, globals_1.it)('should return the maintenance record with the specified ID', async () => {
            // Arrange
            const maintenanceId = 'maintenance-id';
            const mockMaintenance = {
                id: maintenanceId,
                asset_id: 'asset-id',
                maintenance_type: 'repair',
            };
            mockRepository.findOne.mockResolvedValue(mockMaintenance);
            // Act
            const result = await (0, maintenanceService_1.getMaintenanceById)(maintenanceId);
            // Assert
            (0, globals_1.expect)(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: maintenanceId },
                relations: ['asset'],
            });
            (0, globals_1.expect)(result).toEqual(mockMaintenance);
        });
        (0, globals_1.it)('should throw an error if the maintenance record is not found', async () => {
            // Arrange
            const maintenanceId = 'non-existent-id';
            mockRepository.findOne.mockResolvedValue(null);
            // Act & Assert
            await (0, globals_1.expect)((0, maintenanceService_1.getMaintenanceById)(maintenanceId)).rejects.toThrow(`Maintenance record with ID ${maintenanceId} not found`);
        });
    });
    (0, globals_1.describe)('completeMaintenance', () => {
        (0, globals_1.it)('should mark maintenance as completed', async () => {
            // Arrange
            const maintenanceId = 'maintenance-id';
            const completionData = {
                completion_date: new Date(),
                technician_id: 'tech-123',
                notes: 'Replaced screen',
            };
            const mockMaintenance = new Maintenance_1.Maintenance();
            mockMaintenance.id = maintenanceId;
            mockMaintenance.status = 'scheduled';
            mockRepository.findOne.mockResolvedValue(mockMaintenance);
            mockRepository.save.mockImplementation((input, options) => {
                if (Array.isArray(input)) {
                    return Promise.resolve(input);
                }
                else {
                    return Promise.resolve(input);
                }
            });
            // Act
            const result = await (0, maintenanceService_1.completeMaintenance)(maintenanceId, completionData);
            // Assert
            (0, globals_1.expect)(result.status).toBe('completed');
            (0, globals_1.expect)(result.completed_date).toEqual(completionData.completion_date);
            (0, globals_1.expect)(result.performed_by).toBe(completionData.technician_id);
            (0, globals_1.expect)(result.notes).toBe(completionData.notes);
        });
    });
});
