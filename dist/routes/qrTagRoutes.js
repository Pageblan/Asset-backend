"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qrCodeController_1 = require("../controllers/qrCodeController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/qr-tags/asset/{assetId}:
 *   post:
 *     summary: Generate QR code for an asset
 *     tags: [QR Tags]
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
 *         description: QR code generated successfully
 *       400:
 *         description: Error generating QR code
 */
router.post('/asset/:assetId', qrCodeController_1.generateQRCodeHandler);
/**
 * @swagger
 * /api/qr-tags/validate:
 *   post:
 *     summary: Validate QR code data
 *     tags: [QR Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrData
 *             properties:
 *               qrData:
 *                 type: string
 *     responses:
 *       200:
 *         description: QR code validated successfully
 *       400:
 *         description: Invalid QR code
 */
router.post('/validate', qrCodeController_1.validateQRCodeHandler);
/**
 * @swagger
 * /api/qr-tags/asset/{assetId}/regenerate:
 *   post:
 *     summary: Regenerate QR code for an asset
 *     tags: [QR Tags]
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
 *         description: QR code regenerated successfully
 *       400:
 *         description: Error regenerating QR code
 */
router.post('/asset/:assetId/regenerate', qrCodeController_1.regenerateQRCodeHandler);
/**
 * @swagger
 * /api/qr-tags/asset/{assetId}/deactivate:
 *   post:
 *     summary: Deactivate QR code for an asset
 *     tags: [QR Tags]
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
 *         description: QR code deactivated successfully
 *       400:
 *         description: Error deactivating QR code
 */
router.post('/asset/:assetId/deactivate', qrCodeController_1.deactivateQRCodeHandler);
exports.default = router;
