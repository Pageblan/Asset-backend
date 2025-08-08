"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRequest = exports.approveOrRejectRequest = exports.updateRequest = exports.getRequestsByDepartment = exports.getAllRequests = exports.getRequestById = exports.createRequest = void 0;
const database_1 = require("../config/database");
const Request_1 = require("../entities/Request");
const Approval_1 = require("../entities/Approval");
const Department_1 = require("../entities/Department");
/**
 * Create a new asset request
 * @param requestData Request data
 * @returns Created request
 */
const createRequest = async (requestData) => {
    const requestRepository = database_1.AppDataSource.getRepository(Request_1.Request);
    const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
    // Verify department exists
    if (!requestData.department_id) {
        throw new Error('Department ID is required');
    }
    const department = await departmentRepository.findOneBy({ id: requestData.department_id });
    if (!department) {
        throw new Error(`Department with ID ${requestData.department_id} not found`);
    }
    // Create request
    const request = new Request_1.Request();
    request.department_id = requestData.department_id;
    request.requester_id = requestData.requester_id || ''; // Add null check here too
    request.purpose = requestData.purpose || '';
    request.status = 'pending';
    request.priority = requestData.priority || 'medium';
    request.notes = requestData.notes;
    // Save request
    return await requestRepository.save(request);
};
exports.createRequest = createRequest;
/**
 * Get request by ID
 * @param id Request ID
 * @returns Request
 */
const getRequestById = async (id) => {
    const requestRepository = database_1.AppDataSource.getRepository(Request_1.Request);
    const request = await requestRepository.findOne({
        where: { id },
        relations: ['department', 'approvals']
    });
    if (!request) {
        throw new Error(`Request with ID ${id} not found`);
    }
    return request;
};
exports.getRequestById = getRequestById;
/**
 * Get all requests with optional filtering
 * @param filters Optional filters
 * @returns List of requests
 */
const getAllRequests = async (filters) => {
    const requestRepository = database_1.AppDataSource.getRepository(Request_1.Request);
    // Build query
    const queryBuilder = requestRepository.createQueryBuilder('request')
        .leftJoinAndSelect('request.department', 'department')
        .leftJoinAndSelect('request.approvals', 'approval');
    // Apply filters if provided
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                queryBuilder.andWhere(`request.${key} = :${key}`, { [key]: value });
            }
        });
    }
    // Execute query
    return await queryBuilder.getMany();
};
exports.getAllRequests = getAllRequests;
/**
 * Get all requests for a department
 * @param departmentId Department ID
 * @returns List of requests
 */
const getRequestsByDepartment = async (departmentId) => {
    const requestRepository = database_1.AppDataSource.getRepository(Request_1.Request);
    return await requestRepository.find({
        where: { department_id: departmentId },
        relations: ['approvals'],
        order: { created_at: 'DESC' }
    });
};
exports.getRequestsByDepartment = getRequestsByDepartment;
/**
 * Update request
 * @param id Request ID
 * @param requestData Request data to update
 * @returns Updated request
 */
const updateRequest = async (id, requestData) => {
    const requestRepository = database_1.AppDataSource.getRepository(Request_1.Request);
    const request = await (0, exports.getRequestById)(id);
    // Update fields
    Object.assign(request, requestData);
    // Save updated request
    return await requestRepository.save(request);
};
exports.updateRequest = updateRequest;
/**
 * Approve or reject a request
 * @param requestId Request ID
 * @param approvalData Approval data
 * @returns Created approval record
 */
const approveOrRejectRequest = async (requestId, approvalData) => {
    const requestRepository = database_1.AppDataSource.getRepository(Request_1.Request);
    const approvalRepository = database_1.AppDataSource.getRepository(Approval_1.Approval);
    // Verify request exists
    const request = await (0, exports.getRequestById)(requestId);
    // Create approval record
    const approval = new Approval_1.Approval();
    approval.request_id = requestId;
    approval.approver_id = approvalData.approver_id;
    approval.status = approvalData.status;
    approval.comments = approvalData.comments;
    // Save approval record
    const savedApproval = await approvalRepository.save(approval);
    // Update request status
    request.status = approvalData.status;
    await requestRepository.save(request);
    return savedApproval;
};
exports.approveOrRejectRequest = approveOrRejectRequest;
/**
 * Cancel a request
 * @param id Request ID
 * @param cancelledBy User ID of the person cancelling
 * @param reason Cancellation reason
 * @returns Updated request
 */
const cancelRequest = async (id, cancelledBy, reason) => {
    const requestRepository = database_1.AppDataSource.getRepository(Request_1.Request);
    const request = await (0, exports.getRequestById)(id);
    // Update request
    request.status = 'cancelled';
    request.notes = request.notes
        ? `${request.notes}\n\nCancelled by ${cancelledBy}: ${reason}`
        : `Cancelled by ${cancelledBy}: ${reason}`;
    // Save updated request
    return await requestRepository.save(request);
};
exports.cancelRequest = cancelRequest;
