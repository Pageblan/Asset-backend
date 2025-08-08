"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnAsset = exports.reassignAsset = exports.acknowledgeAssignment = exports.getAssignmentsByAsset = exports.getAssignmentsByDepartment = exports.getAssignmentById = exports.assignAsset = void 0;
const database_1 = require("../config/database");
const Assignment_1 = require("../entities/Assignment");
const Asset_1 = require("../entities/Asset");
const Department_1 = require("../entities/Department");
const assetService_1 = require("./assetService");
/**
 * Assign an asset to a department
 * @param assetId Asset ID
 * @param departmentId Department ID
 * @param assignedBy User ID of the person making the assignment
 * @param notes Optional notes about the assignment
 * @returns Created assignment record
 */
const assignAsset = async (assetId, departmentId, assignedBy, notes) => {
    const assignmentRepository = database_1.AppDataSource.getRepository(Assignment_1.Assignment);
    const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Verify asset exists and is available
    const asset = await (0, assetService_1.getAssetById)(assetId);
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
    const assignment = new Assignment_1.Assignment();
    assignment.asset_id = assetId;
    assignment.department_id = departmentId;
    assignment.assigned_by = assignedBy;
    assignment.notes = notes !== null && notes !== void 0 ? notes : null;
    assignment.is_active = true;
    // Update asset status
    asset.status = 'assigned';
    await assetRepository.save(asset);
    // Save assignment record
    return await assignmentRepository.save(assignment);
};
exports.assignAsset = assignAsset;
/**
 * Get assignment by ID
 * @param id Assignment ID
 * @returns Assignment record
 */
const getAssignmentById = async (id) => {
    const assignmentRepository = database_1.AppDataSource.getRepository(Assignment_1.Assignment);
    const assignment = await assignmentRepository.findOne({
        where: { id },
        relations: ['asset', 'department']
    });
    if (!assignment) {
        throw new Error(`Assignment with ID ${id} not found`);
    }
    return assignment;
};
exports.getAssignmentById = getAssignmentById;
/**
 * Get all assignments for a department
 * @param departmentId Department ID
 * @returns List of assignment records
 */
const getAssignmentsByDepartment = async (departmentId) => {
    const assignmentRepository = database_1.AppDataSource.getRepository(Assignment_1.Assignment);
    return await assignmentRepository.find({
        where: {
            department_id: departmentId,
            is_active: true
        },
        relations: ['asset'],
        order: { assigned_at: 'DESC' }
    });
};
exports.getAssignmentsByDepartment = getAssignmentsByDepartment;
/**
 * Get all assignments for an asset
 * @param assetId Asset ID
 * @returns List of assignment records
 */
const getAssignmentsByAsset = async (assetId) => {
    const assignmentRepository = database_1.AppDataSource.getRepository(Assignment_1.Assignment);
    return await assignmentRepository.find({
        where: { asset_id: assetId },
        relations: ['department'],
        order: { assigned_at: 'DESC' }
    });
};
exports.getAssignmentsByAsset = getAssignmentsByAsset;
/**
 * Acknowledge assignment
 * @param id Assignment ID
 * @param acknowledgedBy User ID of the person acknowledging
 * @param notes Optional notes
 * @returns Updated assignment record
 */
const acknowledgeAssignment = async (id, acknowledgedBy, notes) => {
    const assignmentRepository = database_1.AppDataSource.getRepository(Assignment_1.Assignment);
    const assignment = await (0, exports.getAssignmentById)(id);
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
exports.acknowledgeAssignment = acknowledgeAssignment;
/**
 * Reassign an asset to a different department
 * @param assetId Asset ID
 * @param newDepartmentId New department ID
 * @param assignedBy User ID of the person making the reassignment
 * @param notes Optional notes about the reassignment
 * @returns Created assignment record
 */
const reassignAsset = async (assetId, newDepartmentId, assignedBy, notes) => {
    const assignmentRepository = database_1.AppDataSource.getRepository(Assignment_1.Assignment);
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
    return await (0, exports.assignAsset)(assetId, newDepartmentId, assignedBy, notes);
};
exports.reassignAsset = reassignAsset;
/**
 * Return an asset from a department
 * @param id Assignment ID
 * @param returnedBy User ID of the person processing the return
 * @param notes Optional notes about the return
 * @returns Updated assignment record
 */
const returnAsset = async (id, returnedBy, notes) => {
    const assignmentRepository = database_1.AppDataSource.getRepository(Assignment_1.Assignment);
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    const assignment = await (0, exports.getAssignmentById)(id);
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
    const asset = await (0, assetService_1.getAssetById)(assignment.asset_id);
    asset.status = 'available';
    await assetRepository.save(asset);
    // Save updated assignment record
    return await assignmentRepository.save(assignment);
};
exports.returnAsset = returnAsset;
