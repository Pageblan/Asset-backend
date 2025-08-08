import { AppDataSource } from '../config/database';
import { Maintenance } from '../entities/Maintenance';
import { Asset } from '../entities/Asset';
import { getAssetById } from './assetService';
import { Between } from 'typeorm';

/**
 * Schedule maintenance for an asset
 * @param assetId Asset ID
 * @param maintenanceData Maintenance data
 * @returns Created maintenance record
 */
export const scheduleMaintenance = async (
    assetId: string, 
    maintenanceData: Partial<Maintenance>
): Promise<Maintenance> => {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    
    // Verify asset exists
    await getAssetById(assetId);
    
    // Create maintenance record
    const maintenance = new Maintenance();
    maintenance.asset_id = assetId;
    maintenance.maintenance_type = maintenanceData.maintenance_type || 'general';
    maintenance.scheduled_date = maintenanceData.scheduled_date || new Date();
    maintenance.description = maintenanceData.description || 'No description provided';
    maintenance.status = 'scheduled';
    
    // Save maintenance record
    return await maintenanceRepository.save(maintenance);
};

/**
 * Get maintenance record by ID
 * @param id Maintenance ID
 * @returns Maintenance record
 */
export const getMaintenanceById = async (id: string): Promise<Maintenance> => {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await maintenanceRepository.findOne({
        where: { id },
        relations: ['asset']
    });
    
    if (!maintenance) {
        throw new Error(`Maintenance record with ID ${id} not found`);
    }
    
    return maintenance;
};

/**
 * Get all maintenance records for an asset
 * @param assetId Asset ID
 * @returns List of maintenance records
 */
export const getMaintenanceByAssetId = async (assetId: string): Promise<Maintenance[]> => {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    return await maintenanceRepository.find({
        where: { asset_id: assetId },
        order: { scheduled_date: 'DESC' }
    });
};

/**
 * Get all upcoming maintenance
 * @param days Number of days to look ahead (default: 30)
 * @returns List of upcoming maintenance records
 */
export const getUpcomingMaintenance = async (days: number = 30): Promise<Maintenance[]> => {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    
    // Calculate date range
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    
    return await maintenanceRepository.find({
        where: {
            scheduled_date: Between(today, endDate),
            status: 'scheduled'
        },
        relations: ['asset'],
        order: { scheduled_date: 'ASC' }
    });
};

/**
 * Update maintenance record
 * @param id Maintenance ID
 * @param maintenanceData Maintenance data to update
 * @returns Updated maintenance record
 */
export const updateMaintenance = async (
    id: string, 
    maintenanceData: Partial<Maintenance>
): Promise<Maintenance> => {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await getMaintenanceById(id);
    
    // Update fields
    Object.assign(maintenance, maintenanceData);
    
    // Save updated maintenance record
    return await maintenanceRepository.save(maintenance);
};

/**
 * Complete maintenance
 * @param id Maintenance ID
 * @param completionData Completion data
 * @returns Updated maintenance record
 */
export const completeMaintenance = async (
    id: string, 
    completionData: { 
        completion_date: Date, 
        technician_id: string, 
        notes: string 
    }
): Promise<Maintenance> => {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await getMaintenanceById(id);
    
    // Update maintenance record
    maintenance.status = 'completed';
    maintenance.completed_date = completionData.completion_date;
    maintenance.performed_by = completionData.technician_id; // Use technician_id as performed_by
    maintenance.notes = completionData.notes;
    
    // Save updated maintenance record
    return await maintenanceRepository.save(maintenance);
};

/**
 * Cancel maintenance
 * @param id Maintenance ID
 * @param reason Cancellation reason
 * @returns Updated maintenance record
 */
export const cancelMaintenance = async (id: string, reason: string): Promise<Maintenance> => {
    const maintenanceRepository = AppDataSource.getRepository(Maintenance);
    const maintenance = await getMaintenanceById(id);
    
    // Update maintenance record
    maintenance.status = 'cancelled';
    maintenance.notes = maintenance.notes 
        ? `${maintenance.notes}\n\nCancellation reason: ${reason}` 
        : `Cancellation reason: ${reason}`;
    
    // Save updated maintenance record
    return await maintenanceRepository.save(maintenance);
};