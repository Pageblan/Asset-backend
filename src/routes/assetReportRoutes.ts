import { Router } from 'express';
import { getAssetsByStatusReport } from '../controllers/assetReportController';

const router = Router();

/**
 * @swagger
 * /api/reports/assets-by-status:
 *   get:
 *     summary: Get assets count by status
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: Successful response with assets count by status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   count:
 *                     type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/assets-by-status', getAssetsByStatusReport);

export default router;