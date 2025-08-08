import { AppDataSource } from '../config/database';
import { Request as AssetRequest } from '../entities/Request';
import { Approval } from '../entities/Approval';
import { Department } from '../entities/Department';

/**
 * Create a new asset request
 * @param requestData Request data
 * @returns Created request
 */
export const createRequest = async (requestData: Partial<AssetRequest>): Promise<AssetRequest> => {
    const requestRepository = AppDataSource.getRepository(AssetRequest);
    const departmentRepository = AppDataSource.getRepository(Department);
    
    // Verify department exists
    if (!requestData.department_id) {
        throw new Error('Department ID is required');
    }
    
    const department = await departmentRepository.findOneBy({ id: requestData.department_id });
    if (!department) {
        throw new Error(`Department with ID ${requestData.department_id} not found`);
    }
    
    // Create request
    const request = new AssetRequest();
    request.department_id = requestData.department_id;
    request.requester_id = requestData.requester_id || '';  // Add null check here too
    request.purpose = requestData.purpose || '';
    request.status = 'pending';
    request.priority = requestData.priority || 'medium';
    request.notes = requestData.notes;
    
    // Save request
    return await requestRepository.save(request);
};

/**
 * Get request by ID
 * @param id Request ID
 * @returns Request
 */
export const getRequestById = async (id: string): Promise<AssetRequest> => {
    const requestRepository = AppDataSource.getRepository(AssetRequest);
    const request = await requestRepository.findOne({
        where: { id },
        relations: ['department', 'approvals']
    });
    
    if (!request) {
        throw new Error(`Request with ID ${id} not found`);
    }
    
    return request;
};

/**
 * Get all requests with optional filtering
 * @param filters Optional filters
 * @returns List of requests
 */
export const getAllRequests = async (filters?: Partial<AssetRequest>): Promise<AssetRequest[]> => {
    const requestRepository = AppDataSource.getRepository(AssetRequest);
    
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

/**
 * Get all requests for a department
 * @param departmentId Department ID
 * @returns List of requests
 */
export const getRequestsByDepartment = async (departmentId: string): Promise<AssetRequest[]> => {
    const requestRepository = AppDataSource.getRepository(AssetRequest);
    return await requestRepository.find({
        where: { department_id: departmentId },
        relations: ['approvals'],
        order: { created_at: 'DESC' }
    });
};

/**
 * Update request
 * @param id Request ID
 * @param requestData Request data to update
 * @returns Updated request
 */
export const updateRequest = async (
    id: string, 
    requestData: Partial<AssetRequest>
): Promise<AssetRequest> => {
    const requestRepository = AppDataSource.getRepository(AssetRequest);
    const request = await getRequestById(id);
    
    // Update fields
    Object.assign(request, requestData);
    
    // Save updated request
    return await requestRepository.save(request);
};

/**
 * Approve or reject a request
 * @param requestId Request ID
 * @param approvalData Approval data
 * @returns Created approval record
 */
export const approveOrRejectRequest = async (
    requestId: string,
    approvalData: {
        approver_id: string;
        status: 'approved' | 'rejected';
        comments?: string;
    }
): Promise<Approval> => {
    const requestRepository = AppDataSource.getRepository(AssetRequest);
    const approvalRepository = AppDataSource.getRepository(Approval);
    
    // Verify request exists
    const request = await getRequestById(requestId);
    
    // Create approval record
    const approval = new Approval();
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

/**
 * Cancel a request
 * @param id Request ID
 * @param cancelledBy User ID of the person cancelling
 * @param reason Cancellation reason
 * @returns Updated request
 */
export const cancelRequest = async (
    id: string,
    cancelledBy: string,
    reason: string
): Promise<AssetRequest> => {
    const requestRepository = AppDataSource.getRepository(AssetRequest);
    const request = await getRequestById(id);
    
    // Update request
    request.status = 'cancelled';
    request.notes = request.notes 
        ? `${request.notes}\n\nCancelled by ${cancelledBy}: ${reason}` 
        : `Cancelled by ${cancelledBy}: ${reason}`;
    
    // Save updated request
    return await requestRepository.save(request);
};