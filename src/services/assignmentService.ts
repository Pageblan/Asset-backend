import { AppDataSource } from '../config/database';
import { Assignment } from '../entities/Assignment';
import { Asset } from '../entities/Asset';
import { Department } from '../entities/Department';
import { getAssetById } from './assetService';

/**
 * Assign an asset to a department
 * @param assetId Asset ID
 * @param departmentId Department ID
 * @param assignedBy User ID of the person making the assignment
 * @param notes Optional notes about the assignment
 * @returns Created assignment record
 */
export const assignAsset = async (
    assetId: string,
    departmentId: string,
    assignedBy: string,
    notes?: string
): Promise<Assignment> => {
    const assignmentRepository = AppDataSource.getRepository(Assignment);
    const departmentRepository = AppDataSource.getRepository(Department);
    const assetRepository = AppDataSource.getRepository(Asset);
    
    // Verify asset exists and is available
    const asset = await getAssetById(assetId);
    if (asset.status !== 'available') {
        throw new Error(`Asset with ID ${assetId} is not available for assignment`);
    }
    
    // Verify department exists
    const department = await departmentRepository.findOneBy({ id: departmentId });
    if (!department) {
        throw new Error(`Department with ID ${departmentId} not found`);
    }
    
    // Check if asset is already assigned
    const existingAssignment = await assignmentRepository.findOne({
        where: {
            asset_id: assetId,
            is_active: true
        }
    });
    
    if (existingAssignment) {
        throw new Error(`Asset is already assigned to department ${existingAssignment.department_id}`);
    }
    
    // Create assignment record
    const assignment = new Assignment();
    assignment.asset_id = assetId;
    assignment.department_id = departmentId;
    assignment.assigned_by = assignedBy;
    assignment.notes = notes ?? null;
    assignment.is_active = true;
    
    // Update asset status
    asset.status = 'assigned';
    await assetRepository.save(asset);
    
    // Save assignment record
    return await assignmentRepository.save(assignment);
};

/**
 * Get assignment by ID
 * @param id Assignment ID
 * @returns Assignment record
 */
export const getAssignmentById = async (id: string): Promise<Assignment> => {
    const assignmentRepository = AppDataSource.getRepository(Assignment);
    const assignment = await assignmentRepository.findOne({
        where: { id },
        relations: ['asset', 'department']
    });
    
    if (!assignment) {
        throw new Error(`Assignment with ID ${id} not found`);
    }
    
    return assignment;
};

/**
 * Get all assignments for a department
 * @param departmentId Department ID
 * @returns List of assignment records
 */
export const getAssignmentsByDepartment = async (departmentId: string): Promise<Assignment[]> => {
    const assignmentRepository = AppDataSource.getRepository(Assignment);
    return await assignmentRepository.find({
        where: {
            department_id: departmentId,
            is_active: true
        },
        relations: ['asset'],
        order: { assigned_at: 'DESC' }
    });
};

/**
 * Get all assignments for an asset
 * @param assetId Asset ID
 * @returns List of assignment records
 */
export const getAssignmentsByAsset = async (assetId: string): Promise<Assignment[]> => {
    const assignmentRepository = AppDataSource.getRepository(Assignment);
    return await assignmentRepository.find({
        where: { asset_id: assetId },
        relations: ['department'],
        order: { assigned_at: 'DESC' }
    });
};

/**
 * Acknowledge assignment
 * @param id Assignment ID
 * @param acknowledgedBy User ID of the person acknowledging
 * @param notes Optional notes
 * @returns Updated assignment record
 */
export const acknowledgeAssignment = async (
    id: string,
    acknowledgedBy: string,
    notes?: string
): Promise<Assignment> => {
    const assignmentRepository = AppDataSource.getRepository(Assignment);
    const assignment = await getAssignmentById(id);
    
    // Update assignment record
    assignment.acknowledged_by = acknowledgedBy;
    assignment.acknowledged_at = new Date();
    if (notes) {
        assignment.notes = assignment.notes 
            ? `${assignment.notes}\n\nAcknowledgment: ${notes}` 
            : `Acknowledgment: ${notes}`;
    }
    
    // Save updated assignment record
    return await assignmentRepository.save(assignment);
};

/**
 * Reassign an asset to a different department
 * @param assetId Asset ID
 * @param newDepartmentId New department ID
 * @param assignedBy User ID of the person making the reassignment
 * @param notes Optional notes about the reassignment
 * @returns Created assignment record
 */
export const reassignAsset = async (
    assetId: string,
    newDepartmentId: string,
    assignedBy: string,
    notes?: string
): Promise<Assignment> => {
    const assignmentRepository = AppDataSource.getRepository(Assignment);
    
    // Find current active assignment
    const currentAssignment = await assignmentRepository.findOne({
        where: {
            asset_id: assetId,
            is_active: true
        }
    });
    
    if (currentAssignment) {
        // Deactivate current assignment
        currentAssignment.is_active = false;
        currentAssignment.notes = currentAssignment.notes 
            ? `${currentAssignment.notes}\n\nReassigned to department ${newDepartmentId}` 
            : `Reassigned to department ${newDepartmentId}`;
        await assignmentRepository.save(currentAssignment);
    }
    
    // Create new assignment
    return await assignAsset(assetId, newDepartmentId, assignedBy, notes);
};

/**
 * Return an asset from a department
 * @param id Assignment ID
 * @param returnedBy User ID of the person processing the return
 * @param notes Optional notes about the return
 * @returns Updated assignment record
 */
export const returnAsset = async (
    id: string,
    returnedBy: string,
    notes?: string
): Promise<Assignment> => {
    const assignmentRepository = AppDataSource.getRepository(Assignment);
    const assetRepository = AppDataSource.getRepository(Asset);
    const assignment = await getAssignmentById(id);
    
    // Update assignment record
    assignment.is_active = false;
    assignment.returned_by = returnedBy;
    assignment.returned_at = new Date();
    if (notes) {
        assignment.notes = assignment.notes 
            ? `${assignment.notes}\n\nReturn: ${notes}` 
            : `Return: ${notes}`;
    }
    
    // Update asset status
    const asset = await getAssetById(assignment.asset_id);
    asset.status = 'available';
    await assetRepository.save(asset);
    
    // Save updated assignment record
    return await assignmentRepository.save(assignment);
};