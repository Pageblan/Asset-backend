"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maintenanceController_1 = require("../controllers/maintenanceController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/maintenance/upcoming:
 *   get:
 *     summary: Get upcoming maintenance
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of days to look ahead (default: 30)
 *     responses:
 *       200:
 *         description: List of upcoming maintenance records
 *       500:
 *         description: Server error
 */
router.get('/upcoming', maintenanceController_1.getUpcomingMaintenanceHandler);
/**
 * @swagger
 * /api/maintenance/{id}:
 *   get:
 *     summary: Get maintenance record by ID
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance ID
 *     responses:
 *       200:
 *         description: Maintenance record details
 *       404:
 *         description: Maintenance record not found
 */
router.get('/:id', maintenanceController_1.getMaintenanceByIdHandler);
/**
 * @swagger
 * /api/maintenance/asset/{assetId}:
 *   get:
 *     summary: Get all maintenance records for an asset
 *     tags: [Maintenance]
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
 *         description: List of maintenance records
 *       500:
 *         description: Server error
 */
router.get('/asset/:assetId', maintenanceController_1.getMaintenanceByAssetIdHandler);
/**
 * @swagger
 * /api/maintenance/asset/{assetId}:
 *   post:
 *     summary: Schedule maintenance for an asset
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
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
 *               - maintenance_type
 *               - scheduled_date
 *             properties:
 *               maintenance_type:
 *                 type: string
 *               scheduled_date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Maintenance scheduled successfully
 *       500:
 *         description: Server error
 */
router.post('/asset/:assetId', maintenanceController_1.scheduleMaintenanceHandler);
/**
 * @swagger
 * /api/maintenance/{id}:
 *   put:
 *     summary: Update maintenance record
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maintenance_type:
 *                 type: string
 *               scheduled_date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Maintenance record updated successfully
 *       404:
 *         description: Maintenance record not found
 *       500:
 *         description: Server error
 */
router.put('/:id', maintenanceController_1.updateMaintenanceHandler);
/**
 * @swagger
 * /api/maintenance/{id}/complete:
 *   post:
 *     summary: Complete maintenance
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - completion_date
 *               - technician_id
 *             properties:
 *               completion_type:
 *                 type: string
 *               completion_date:
 *                 type: string
 *                 format: date-time
 *               technician_id:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Maintenance completed successfully
 *       404:
 *         description: Maintenance record not found
 *       500:
 *         description: Server error
 */
router.post('/:id/complete', maintenanceController_1.completeMaintenanceHandler);
/**
 * @swagger
 * /api/maintenance/{id}/cancel:
 *   post:
 *     summary: Cancel maintenance
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Maintenance cancelled successfully
 *       404:
 *         description: Maintenance record not found
 *       500:
 *         description: Server error
 */
router.post('/:id/cancel', maintenanceController_1.cancelMaintenanceHandler);
exports.default = router;
