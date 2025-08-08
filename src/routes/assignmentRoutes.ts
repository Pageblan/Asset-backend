import express from 'express';
import {
    assign,
    getById,
    getByDepartment,
    getByAsset,
    acknowledge,
    reassign,
    returnAssetController
} from '../controllers/assignmentController';

const router = express.Router();

/**
 * @swagger
 * /api/assignments/asset/{assetId}/department/{departmentId}:
 *   post:
 *     summary: Assign an asset to a department
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignedBy
 *             properties:
 *               assignedBy:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asset assigned successfully
 *       500:
 *         description: Server error
 */
router.post('/asset/:assetId/department/:departmentId', assign);

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment details
 *       404:
 *         description: Assignment not found
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/assignments/department/{departmentId}:
 *   get:
 *     summary: Get all assignments for a department
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: List of assignments
 *       500:
 *         description: Server error
 */
router.get('/department/:departmentId', getByDepartment);

/**
 * @swagger
 * /api/assignments/asset/{assetId}:
 *   get:
 *     summary: Get all assignments for an asset
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: List of assignments
 *       500:
 *         description: Server error
 */
router.get('/asset/:assetId', getByAsset);

/**
 * @swagger
 * /api/assignments/{id}/acknowledge:
 *   post:
 *     summary: Acknowledge assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - acknowledgedBy
 *             properties:
 *               acknowledgedBy:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Assignment acknowledged successfully
 *       500:
 *         description: Server error
 */
router.post('/:id/acknowledge', acknowledge);

/**
 * @swagger
 * /api/assignments/asset/{assetId}/reassign/{newDepartmentId}:
 *   post:
 *     summary: Reassign an asset to a different department
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *       - in: path
 *         name: newDepartmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: New Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignedBy
 *             properties:
 *               assignedBy:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asset reassigned successfully
 *       500:
 *         description: Server error
 */
router.post('/asset/:assetId/reassign/:newDepartmentId', reassign);

/**
 * @swagger
 * /api/assignments/{id}/return:
 *   post:
 *     summary: Return an asset from a department
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - returnedBy
 *             properties:
 *               returnedBy:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset returned successfully
 *       500:
 *         description: Server error
 */
router.post('/:id/return', returnAssetController);

export default router;