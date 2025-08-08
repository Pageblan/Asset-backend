import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../config/database';
import { QRTag } from '../entities/QrTag';
import { Asset } from '../entities/Asset';

// Directory to store QR code images
const QR_CODE_DIR = path.join(__dirname, '../../public/qrcodes');

// Ensure the directory exists
if (!fs.existsSync(QR_CODE_DIR)) {
    fs.mkdirSync(QR_CODE_DIR, { recursive: true });
}

/**
 * Generate a QR code for an asset
 * @param assetId The ID of the asset
 * @returns The path to the generated QR code image
 */
export const generateQRCode = async (assetId: string): Promise<string> => {
    try {
        // Get the asset
        const assetRepository = AppDataSource.getRepository(Asset);
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
        const filename = `${asset.asset_id}_${uuidv4()}.png`;
        const filePath = path.join(QR_CODE_DIR, filename);
        const relativePath = `/qrcodes/${filename}`;

        // Generate QR code
        await QRCode.toFile(filePath, qrData, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });

        // Save QR tag in database
        const qrTagRepository = AppDataSource.getRepository(QRTag);
        const qrTag = new QRTag();
        qrTag.asset_id = assetId;
        qrTag.qr_data = qrData;
        qrTag.qr_image_path = relativePath;
        await qrTagRepository.save(qrTag);

        return relativePath;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

/**
 * Validate a QR code
 * @param qrData The data from the scanned QR code
 * @returns The asset information if valid
 */
export const validateQRCode = async (qrData: string): Promise<any> => {
    try {
        // Parse QR data
        const data = JSON.parse(qrData);
        
        // Get the asset
        const assetRepository = AppDataSource.getRepository(Asset);
        const asset = await assetRepository.findOneBy({ id: data.assetId });

        if (!asset) {
            throw new Error(`Asset with ID ${data.assetId} not found`);
        }

        // Check if QR tag exists and is active
        const qrTagRepository = AppDataSource.getRepository(QRTag);
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
    } catch (error) {
        console.error('Error validating QR code:', error);
        throw error;
    }
};

/**
 * Deactivate a QR code for an asset
 * @param assetId The ID of the asset
 * @returns void
 */
export const deactivateQRCode = async (assetId: string): Promise<void> => {
    try {
        // Get the QR tags for this asset
        const qrTagRepository = AppDataSource.getRepository(QRTag);
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
    } catch (error) {
        console.error('Error deactivating QR code:', error);
        throw error;
    }
};

/**
 * Regenerate a QR code for an asset
 * @param assetId The ID of the asset
 * @returns The path to the regenerated QR code image
 */
export const regenerateQRCode = async (assetId: string): Promise<string> => {
    try {
        // Deactivate existing QR codes
        await deactivateQRCode(assetId);
        
        // Generate a new QR code
        return await generateQRCode(assetId);
    } catch (error) {
        console.error('Error regenerating QR code:', error);
        throw error;
    }
};