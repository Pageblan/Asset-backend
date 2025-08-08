import { Request, Response } from 'express';
import {
    assignAsset,
    getAssignmentById,
    getAssignmentsByDepartment,
    getAssignmentsByAsset,
    acknowledgeAssignment,
    reassignAsset,
    returnAsset
} from '../services/assignmentService';

/**
 * Assign an asset to a department
 * @param req Request
 * @param res Response
 */
export const assign = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assetId, departmentId } = req.params;
        const { assignedBy, notes } = req.body;
        const assignment = await assignAsset(assetId, departmentId, assignedBy, notes);
        res.status(201).json(assignment);
    } catch (error) {
        console.error('Error assigning asset:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to assign asset', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to assign asset', error: 'An unknown error occurred 2.1' });
        }
    }
};

/**
 * Get assignment by ID
 * @param req Request
 * @param res Response
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const assignment = await getAssignmentById(id);
        res.status(200).json(assignment);
    } catch (error) {
        console.error('Error getting assignment:', error);
        if (error instanceof Error) {
            res.status(404).json({ message: 'Assignment not found', error: error.message });
        } else {
            res.status(404).json({ message: 'Assignment not found', error: 'An unknown error occurred 2.2' });
        }
    }
};

/**
 * Get all assignments for a department
 * @param req Request
 * @param res Response
 */
export const getByDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { departmentId } = req.params;
        const assignments = await getAssignmentsByDepartment(departmentId);
        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error getting assignments:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get assignments', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to get assignments', error: 'An unknown error occurred 2.3' });
        }
    }
};

/**
 * Get all assignments for an asset
 * @param req Request
 * @param res Response
 */
export const getByAsset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assetId } = req.params;
        const assignments = await getAssignmentsByAsset(assetId);
        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error getting assignments:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to get assignments', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to get assignments', error: 'An unknown error occurred 2.4' });
        }
    }
};

/**
 * Acknowledge assignment
 * @param req Request
 * @param res Response
 */
export const acknowledge = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { acknowledgedBy, notes } = req.body;
        const assignment = await acknowledgeAssignment(id, acknowledgedBy, notes);
        res.status(200).json(assignment);
    } catch (error) {
        console.error('Error acknowledging assignment:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to acknowledge assignment', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to acknowledge assignment', error: 'An unknown error occurred 2.5' });
        }
    }
};

/**
 * Reassign an asset to a different department
 * @param req Request
 * @param res Response
 */
export const reassign = async (req: Request, res: Response): Promise<void> => {
    try {
        const { assetId, newDepartmentId } = req.params;
        const { assignedBy, notes } = req.body;
        const assignment = await reassignAsset(assetId, newDepartmentId, assignedBy, notes);
        res.status(201).json(assignment);
    } catch (error) {
        console.error('Error reassigning asset:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to reassign asset', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to reassign asset', error: 'An unknown error occurred 2.6' });
        }
    }
};

/**
 * Return an asset from a department
 * @param req Request
 * @param res Response
 */
export const returnAssetController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { returnedBy, notes } = req.body;
        const assignment = await returnAsset(id, returnedBy, notes);
        res.status(200).json(assignment);
    } catch (error) {
        console.error('Error returning asset:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to return asset', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to return asset', error: 'An unknown error occurred 2.7' });
        }
    }
};