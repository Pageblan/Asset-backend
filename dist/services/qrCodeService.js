"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateQRCode = exports.deactivateQRCode = exports.validateQRCode = exports.generateQRCode = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const database_1 = require("../config/database");
const QrTag_1 = require("../entities/QrTag");
const Asset_1 = require("../entities/Asset");
// Directory to store QR code images
const QR_CODE_DIR = path_1.default.join(__dirname, '../../public/qrcodes');
// Ensure the directory exists
if (!fs_1.default.existsSync(QR_CODE_DIR)) {
    fs_1.default.mkdirSync(QR_CODE_DIR, { recursive: true });
}
/**
 * Generate a QR code for an asset
 * @param assetId The ID of the asset
 * @returns The path to the generated QR code image
 */
const generateQRCode = async (assetId) => {
    try {
        // Get the asset
        const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
        const asset = await assetRepository.findOneBy({ id: assetId });
        if (!asset) {
            throw new Error(`Asset with ID ${assetId} not found`);
        }
        // Create QR data
        const qrData = JSON.stringify({
            assetId: asset.id,
            assetCode: asset.asset_id,
            name: asset.name,
            model: asset.model,
            serialNumber: asset.serial_number,
            timestamp: new Date().toISOString()
        });
        // Generate a unique filename
        const filename = `${asset.asset_id}_${(0, uuid_1.v4)()}.png`;
        const filePath = path_1.default.join(QR_CODE_DIR, filename);
        const relativePath = `/qrcodes/${filename}`;
        // Generate QR code
        await qrcode_1.default.toFile(filePath, qrData, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });
        // Save QR tag in database
        const qrTagRepository = database_1.AppDataSource.getRepository(QrTag_1.QRTag);
        const qrTag = new QrTag_1.QRTag();
        qrTag.asset_id = assetId;
        qrTag.qr_data = qrData;
        qrTag.qr_image_path = relativePath;
        await qrTagRepository.save(qrTag);
        return relativePath;
    }
    catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};
exports.generateQRCode = generateQRCode;
/**
 * Validate a QR code
 * @param qrData The data from the scanned QR code
 * @returns The asset information if valid
 */
const validateQRCode = async (qrData) => {
    try {
        // Parse QR data
        const data = JSON.parse(qrData);
        // Get the asset
        const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
        const asset = await assetRepository.findOneBy({ id: data.assetId });
        if (!asset) {
            throw new Error(`Asset with ID ${data.assetId} not found`);
        }
        // Check if QR tag exists and is active
        const qrTagRepository = database_1.AppDataSource.getRepository(QrTag_1.QRTag);
        const qrTag = await qrTagRepository.findOne({
            where: {
                asset_id: data.assetId,
                qr_data: qrData,
                is_active: true
            }
        });
        if (!qrTag) {
            throw new Error('QR code is invalid or has been deactivated');
        }
        return {
            asset,
            qrTag
        };
    }
    catch (error) {
        console.error('Error validating QR code:', error);
        throw error;
    }
};
exports.validateQRCode = validateQRCode;
/**
 * Deactivate a QR code for an asset
 * @param assetId The ID of the asset
 * @returns void
 */
const deactivateQRCode = async (assetId) => {
    try {
        // Get the QR tags for this asset
        const qrTagRepository = database_1.AppDataSource.getRepository(QrTag_1.QRTag);
        const qrTags = await qrTagRepository.find({
            where: {
                asset_id: assetId,
                is_active: true
            }
        });
        if (qrTags.length === 0) {
            throw new Error(`No active QR tags found for asset with ID ${assetId}`);
        }
        // Deactivate all QR tags for this asset
        for (const qrTag of qrTags) {
            qrTag.is_active = false;
            await qrTagRepository.save(qrTag);
        }
    }
    catch (error) {
        console.error('Error deactivating QR code:', error);
        throw error;
    }
};
exports.deactivateQRCode = deactivateQRCode;
/**
 * Regenerate a QR code for an asset
 * @param assetId The ID of the asset
 * @returns The path to the regenerated QR code image
 */
const regenerateQRCode = async (assetId) => {
    try {
        // Deactivate existing QR codes
        await (0, exports.deactivateQRCode)(assetId);
        // Generate a new QR code
        return await (0, exports.generateQRCode)(assetId);
    }
    catch (error) {
        console.error('Error regenerating QR code:', error);
        throw error;
    }
};
exports.regenerateQRCode = regenerateQRCode;
