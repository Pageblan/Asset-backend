"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelMaintenance = exports.completeMaintenance = exports.updateMaintenance = exports.getUpcomingMaintenance = exports.getMaintenanceByAssetId = exports.getMaintenanceById = exports.scheduleMaintenance = void 0;
const database_1 = require("../config/database");
const Maintenance_1 = require("../entities/Maintenance");
const assetService_1 = require("./assetService");
const typeorm_1 = require("typeorm");
/**
 * Schedule maintenance for an asset
 * @param assetId Asset ID
 * @param maintenanceData Maintenance data
 * @returns Created maintenance record
 */
const scheduleMaintenance = async (assetId, maintenanceData) => {
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    // Verify asset exists
    await (0, assetService_1.getAssetById)(assetId);
    // Create maintenance record
    const maintenance = new Maintenance_1.Maintenance();
    maintenance.asset_id = assetId;
    maintenance.maintenance_type = maintenanceData.maintenance_type || 'general';
    maintenance.scheduled_date = maintenanceData.scheduled_date || new Date();
    maintenance.description = maintenanceData.description || 'No description provided';
    maintenance.status = 'scheduled';
    // Save maintenance record
    return await maintenanceRepository.save(maintenance);
};
exports.scheduleMaintenance = scheduleMaintenance;
/**
 * Get maintenance record by ID
 * @param id Maintenance ID
 * @returns Maintenance record
 */
const getMaintenanceById = async (id) => {
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    const maintenance = await maintenanceRepository.findOne({
        where: { id },
        relations: ['asset']
    });
    if (!maintenance) {
        throw new Error(`Maintenance record with ID ${id} not found`);
    }
    return maintenance;
};
exports.getMaintenanceById = getMaintenanceById;
/**
 * Get all maintenance records for an asset
 * @param assetId Asset ID
 * @returns List of maintenance records
 */
const getMaintenanceByAssetId = async (assetId) => {
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    return await maintenanceRepository.find({
        where: { asset_id: assetId },
        order: { scheduled_date: 'DESC' }
    });
};
exports.getMaintenanceByAssetId = getMaintenanceByAssetId;
/**
 * Get all upcoming maintenance
 * @param days Number of days to look ahead (default: 30)
 * @returns List of upcoming maintenance records
 */
const getUpcomingMaintenance = async (days = 30) => {
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    // Calculate date range
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    return await maintenanceRepository.find({
        where: {
            scheduled_date: (0, typeorm_1.Between)(today, endDate),
            status: 'scheduled'
        },
        relations: ['asset'],
        order: { scheduled_date: 'ASC' }
    });
};
exports.getUpcomingMaintenance = getUpcomingMaintenance;
/**
 * Update maintenance record
 * @param id Maintenance ID
 * @param maintenanceData Maintenance data to update
 * @returns Updated maintenance record
 */
const updateMaintenance = async (id, maintenanceData) => {
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    const maintenance = await (0, exports.getMaintenanceById)(id);
    // Update fields
    Object.assign(maintenance, maintenanceData);
    // Save updated maintenance record
    return await maintenanceRepository.save(maintenance);
};
exports.updateMaintenance = updateMaintenance;
/**
 * Complete maintenance
 * @param id Maintenance ID
 * @param completionData Completion data
 * @returns Updated maintenance record
 */
const completeMaintenance = async (id, completionData) => {
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    const maintenance = await (0, exports.getMaintenanceById)(id);
    // Update maintenance record
    maintenance.status = 'completed';
    maintenance.completed_date = completionData.completion_date;
    maintenance.performed_by = completionData.technician_id; // Use technician_id as performed_by
    maintenance.notes = completionData.notes;
    // Save updated maintenance record
    return await maintenanceRepository.save(maintenance);
};
exports.completeMaintenance = completeMaintenance;
/**
 * Cancel maintenance
 * @param id Maintenance ID
 * @param reason Cancellation reason
 * @returns Updated maintenance record
 */
const cancelMaintenance = async (id, reason) => {
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    const maintenance = await (0, exports.getMaintenanceById)(id);
    // Update maintenance record
    maintenance.status = 'cancelled';
    maintenance.notes = maintenance.notes
        ? `${maintenance.notes}\n\nCancellation reason: ${reason}`
        : `Cancellation reason: ${reason}`;
    // Save updated maintenance record
    return await maintenanceRepository.save(maintenance);
};
exports.cancelMaintenance = cancelMaintenance;
