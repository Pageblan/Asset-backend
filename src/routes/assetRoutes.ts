import express from 'express';
import { 
    create, 
    getById, 
    getByAssetId, 
    getAll, 
    update, 
    dispose,
    recalculateDepreciation
} from '../controllers/assetController';

const router = express.Router();

/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: Create a new asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - model
 *               - serial_number
 *               - initial_value
 *             properties:
 *               name:
 *                 type: string
 *               model:
 *                 type: string
 *               serial_number:
 *                 type: string
 *               initial_value:
 *                 type: number
 *               date_received:
 *                 type: string
 *                 format: date-time
 *               depreciation_years:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asset created successfully
 *       500:
 *         description: Server error
 */
router.post('/', create);

/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: Get all assets
 *     tags: [Assets]
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
 *         description: List of assets
 *       500:
 *         description: Server error
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/assets/{id}:
 *   get:
 *     summary: Get asset by ID
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: Asset details
 *       404:
 *         description: Asset not found
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/assets/code/{assetId}:
 *   get:
 *     summary: Get asset by asset_id (formatted ID)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Formatted asset ID (e.g., 23-00001)
 *     responses:
 *       200:
 *         description: Asset details
 *       404:
 *         description: Asset not found
 */
router.get('/code/:assetId', getByAssetId);

/**
 * @swagger
 * /api/assets/{id}:
 *   put:
 *     summary: Update asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               model:
 *                 type: string
 *               serial_number:
 *                 type: string
 *               initial_value:
 *                 type: number
 *               depreciation_years:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset updated successfully
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Server error
 */
router.put('/:id', update);

/**
 * @swagger
 * /api/assets/{id}/dispose:
 *   post:
 *     summary: Dispose an asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - disposalDate
 *             properties:
 *               disposalDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset disposed successfully
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Server error
 */
router.post('/:id/dispose', dispose);

/**
 * @swagger
 * /api/assets/{id}/depreciation:
 *   post:
 *     summary: Recalculate depreciation for an asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: Depreciation calculated successfully
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Server error
 */
router.post('/:id/depreciation', recalculateDepreciation);

export default router;