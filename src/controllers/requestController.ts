import { Request as ExpressRequest, Response } from 'express';
import {
    createRequest,
    getRequestById,
    getAllRequests,
    getRequestsByDepartment,
    updateRequest,
    approveOrRejectRequest,
    cancelRequest
} from '../services/requestService';
import { Request as AssetRequest } from '../entities/Request';

/**
 * Create a new asset request
 * @param req Express Request
 * @param res Response
 */
export const create = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const requestData: Partial<AssetRequest> = req.body;
        const request = await createRequest(requestData);
        res.status(201).json(request);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ 
            message: 'Failed to create request', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.1'
        });
    }
};

/**
 * Get request by ID
 * @param req Express Request
 * @param res Response
 */
export const getById = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const request = await getRequestById(id);
        res.status(200).json(request);
    } catch (error) {
        console.error('Error getting request:', error);
        res.status(404).json({ 
            message: 'Request not found', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.2'
        });
    }
};

/**
 * Get all requests with optional filtering
 * @param req Express Request
 * @param res Response
 */
export const getAll = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const filters = req.query as Partial<AssetRequest>;
        const requests = await getAllRequests(filters);
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error getting requests:', error);
        res.status(500).json({ 
            message: 'Failed to get requests', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.3'
        });
    }
};

/**
 * Get all requests for a department
 * @param req Express Request
 * @param res Response
 */
export const getByDepartment = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const { departmentId } = req.params;
        const requests = await getRequestsByDepartment(departmentId);
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error getting requests:', error);
        res.status(500).json({ 
            message: 'Failed to get requests', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.4'
        });
    }
};

/**
 * Update request
 * @param req Express Request
 * @param res Response
 */
export const update = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const requestData: Partial<AssetRequest> = req.body;
        const request = await updateRequest(id, requestData);
        res.status(200).json(request);
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ 
            message: 'Failed to update request', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.5'
        });
    }
};

/**
 * Approve or reject a request
 * @param req Express Request
 * @param res Response
 */
export const approveOrReject = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const approvalData = req.body;
        const approval = await approveOrRejectRequest(id, approvalData);
        res.status(201).json(approval);
    } catch (error) {
        console.error('Error processing approval:', error);
        res.status(500).json({ 
            message: 'Failed to process approval', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.6'
        });
    }
};

/**
 * Cancel a request
 * @param req Express Request
 * @param res Response
 */
export const cancel = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { cancelledBy, reason } = req.body;
        const request = await cancelRequest(id, cancelledBy, reason);
        res.status(200).json(request);
    } catch (error) {
        console.error('Error cancelling request:', error);
        res.status(500).json({ 
            message: 'Failed to cancel request', 
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.7'
        });
    }
};