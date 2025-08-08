"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnAssetController = exports.reassign = exports.acknowledge = exports.getByAsset = exports.getByDepartment = exports.getById = exports.assign = void 0;
const assignmentService_1 = require("../services/assignmentService");
/**
 * Assign an asset to a department
 * @param req Request
 * @param res Response
 */
const assign = async (req, res) => {
    try {
        const { assetId, departmentId } = req.params;
        const { assignedBy, notes } = req.body;
        const assignment = await (0, assignmentService_1.assignAsset)(assetId, departmentId, assignedBy, notes);
        res.status(201).json(assignment);
    }
    catch (error) {
        console.error('Error assigning asset:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to assign asset', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to assign asset', error: 'An unknown error occurred 2.1' });
        }
    }
};
exports.assign = assign;
/**
 * Get assignment by ID
 * @param req Request
 * @param res Response
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await (0, assignmentService_1.getAssignmentById)(id);
        res.status(200).json(assignment);
    }
    catch (error) {
        console.error('Error getting assignment:', error);
        if (error instanceof Error) {
            res.status(404).json({ message: 'Assignment not found', error: error.message });
        }
        else {
            res.status(404).json({ message: 'Assignment not found', error: 'An unknown error occurred 2.2' });
        }
    }
};
exports.getById = getById;
/**
 * Get all assignments for a department
 * @param req Request
 * @param res Response
 */
const getByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const assignments = await (0, assignmentService_1.getAssignmentsByDepartment)(departmentId);
        res.status(200).json(assignments);
    }
    catch (error) {
        console.error('Error getting assignments:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get assignments', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to get assignments', error: 'An unknown error occurred 2.3' });
        }
    }
};
exports.getByDepartment = getByDepartment;
/**
 * Get all assignments for an asset
 * @param req Request
 * @param res Response
 */
const getByAsset = async (req, res) => {
    try {
        const { assetId } = req.params;
        const assignments = await (0, assignmentService_1.getAssignmentsByAsset)(assetId);
        res.status(200).json(assignments);
    }
    catch (error) {
        console.error('Error getting assignments:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get assignments', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to get assignments', error: 'An unknown error occurred 2.4' });
        }
    }
};
exports.getByAsset = getByAsset;
/**
 * Acknowledge assignment
 * @param req Request
 * @param res Response
 */
const acknowledge = async (req, res) => {
    try {
        const { id } = req.params;
        const { acknowledgedBy, notes } = req.body;
        const assignment = await (0, assignmentService_1.acknowledgeAssignment)(id, acknowledgedBy, notes);
        res.status(200).json(assignment);
    }
    catch (error) {
        console.error('Error acknowledging assignment:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to acknowledge assignment', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to acknowledge assignment', error: 'An unknown error occurred 2.5' });
        }
    }
};
exports.acknowledge = acknowledge;
/**
 * Reassign an asset to a different department
 * @param req Request
 * @param res Response
 */
const reassign = async (req, res) => {
    try {
        const { assetId, newDepartmentId } = req.params;
        const { assignedBy, notes } = req.body;
        const assignment = await (0, assignmentService_1.reassignAsset)(assetId, newDepartmentId, assignedBy, notes);
        res.status(201).json(assignment);
    }
    catch (error) {
        console.error('Error reassigning asset:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to reassign asset', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to reassign asset', error: 'An unknown error occurred 2.6' });
        }
    }
};
exports.reassign = reassign;
/**
 * Return an asset from a department
 * @param req Request
 * @param res Response
 */
const returnAssetController = async (req, res) => {
    try {
        const { id } = req.params;
        const { returnedBy, notes } = req.body;
        const assignment = await (0, assignmentService_1.returnAsset)(id, returnedBy, notes);
        res.status(200).json(assignment);
    }
    catch (error) {
        console.error('Error returning asset:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to return asset', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to return asset', error: 'An unknown error occurred 2.7' });
        }
    }
};
exports.returnAssetController = returnAssetController;
