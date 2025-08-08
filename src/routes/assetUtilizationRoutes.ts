import { Router } from 'express';
import { getAssetUtilizationReport } from '../controllers/assetUtilizationController';

const router = Router();

/**
 * @swagger
 * /api/reports/asset-utilization:
 *   get:
 *     summary: Get asset utilization rates
 *     description: Returns the utilization rates for assets within the specified date range
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the report period (defaults to 30 days ago)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the report period (defaults to current date)
 *     responses:
 *       200:
 *         description: Successful response with asset utilization data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   assetId:
 *                     type: string
 *                   assetName:
 *                     type: string
 *                   utilizationRate:
 *                     type: number
 *                     format: double
 *                     description: Utilization rate as a percentage (0-100)
 *       400:
 *         description: Invalid date parameters
 *       500:
 *         description: Internal server error
 */
router.get('/asset-utilization', getAssetUtilizationReport);

export default router;