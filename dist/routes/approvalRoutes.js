"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const approvalController_1 = require("../controllers/approvalController");
const router = express_1.default.Router();
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
router.get('/', approvalController_1.getAllApprovals);
exports.default = router;
