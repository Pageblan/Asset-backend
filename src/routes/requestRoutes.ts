import express from 'express';
import {
    create,
    getById,
    getAll,
    getByDepartment,
    update,
    approveOrReject,
    cancel
} from '../controllers/requestController';

const router = express.Router();

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a new asset request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - department_id
 *               - requester_id
 *               - purpose
 *             properties:
 *               department_id:
 *                 type: string
 *               requester_id:
 *                 type: string
 *               purpose:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created successfully
 *       500:
 *         description: Server error
 */
router.post('/', create);

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Get all requests
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of requests
 *       500:
 *         description: Server error
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Get request by ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request details
 *       404:
 *         description: Request not found
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/requests/department/{departmentId}:
 *   get:
 *     summary: Get all requests for a department
 *     tags: [Requests]
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
 *         description: List of requests
 *       500:
 *         description: Server error
 */
router.get('/department/:departmentId', getByDepartment);

/**
 * @swagger
 * /api/requests/{id}:
 *   put:
 *     summary: Update request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purpose:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request updated successfully
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.put('/:id', update);

/**
 * @swagger
 * /api/requests/{id}/approve:
 *   post:
 *     summary: Approve or reject a request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approver_id
 *               - status
 *             properties:
 *               approver_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Approval processed successfully
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.post('/:id/approve', approveOrReject);

/**
 * @swagger
 * /api/requests/{id}/cancel:
 *   post:
 *     summary: Cancel a request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancelledBy
 *               - reason
 *             properties:
 *               cancelledBy:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request cancelled successfully
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.post('/:id/cancel', cancel);

export default router;