import express from 'express';
import { getAllApprovals } from '../controllers/approvalController';

const router = express.Router();

/**
 * @swagger
 * /api/approvals:
 *   get:
 *     summary: Get all approval requests
 *     tags: [Approvals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approval requests
 *       500:
 *         description: Server error
 */
router.get('/', getAllApprovals);

export default router;