"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel = exports.approveOrReject = exports.update = exports.getByDepartment = exports.getAll = exports.getById = exports.create = void 0;
const requestService_1 = require("../services/requestService");
/**
 * Create a new asset request
 * @param req Express Request
 * @param res Response
 */
const create = async (req, res) => {
    try {
        const requestData = req.body;
        const request = await (0, requestService_1.createRequest)(requestData);
        res.status(201).json(request);
    }
    catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({
            message: 'Failed to create request',
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.1'
        });
    }
};
exports.create = create;
/**
 * Get request by ID
 * @param req Express Request
 * @param res Response
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await (0, requestService_1.getRequestById)(id);
        res.status(200).json(request);
    }
    catch (error) {
        console.error('Error getting request:', error);
        res.status(404).json({
            message: 'Request not found',
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.2'
        });
    }
};
exports.getById = getById;
/**
 * Get all requests with optional filtering
 * @param req Express Request
 * @param res Response
 */
const getAll = async (req, res) => {
    try {
        const filters = req.query;
        const requests = await (0, requestService_1.getAllRequests)(filters);
        res.status(200).json(requests);
    }
    catch (error) {
        console.error('Error getting requests:', error);
        res.status(500).json({
            message: 'Failed to get requests',
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.3'
        });
    }
};
exports.getAll = getAll;
/**
 * Get all requests for a department
 * @param req Express Request
 * @param res Response
 */
const getByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const requests = await (0, requestService_1.getRequestsByDepartment)(departmentId);
        res.status(200).json(requests);
    }
    catch (error) {
        console.error('Error getting requests:', error);
        res.status(500).json({
            message: 'Failed to get requests',
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.4'
        });
    }
};
exports.getByDepartment = getByDepartment;
/**
 * Update request
 * @param req Express Request
 * @param res Response
 */
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const requestData = req.body;
        const request = await (0, requestService_1.updateRequest)(id, requestData);
        res.status(200).json(request);
    }
    catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({
            message: 'Failed to update request',
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.5'
        });
    }
};
exports.update = update;
/**
 * Approve or reject a request
 * @param req Express Request
 * @param res Response
 */
const approveOrReject = async (req, res) => {
    try {
        const { id } = req.params;
        const approvalData = req.body;
        const approval = await (0, requestService_1.approveOrRejectRequest)(id, approvalData);
        res.status(201).json(approval);
    }
    catch (error) {
        console.error('Error processing approval:', error);
        res.status(500).json({
            message: 'Failed to process approval',
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.6'
        });
    }
};
exports.approveOrReject = approveOrReject;
/**
 * Cancel a request
 * @param req Express Request
 * @param res Response
 */
const cancel = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancelledBy, reason } = req.body;
        const request = await (0, requestService_1.cancelRequest)(id, cancelledBy, reason);
        res.status(200).json(request);
    }
    catch (error) {
        console.error('Error cancelling request:', error);
        res.status(500).json({
            message: 'Failed to cancel request',
            error: error instanceof Error ? error.message : 'An unknown error occurred 3.7'
        });
    }
};
exports.cancel = cancel;
