"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assetReportController_1 = require("../controllers/assetReportController");
const router = (0, express_1.Router)();
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
router.get('/assets-by-status', assetReportController_1.getAssetsByStatusReport);
exports.default = router;
