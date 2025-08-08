"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateQRCodeHandler = exports.regenerateQRCodeHandler = exports.validateQRCodeHandler = exports.generateQRCodeHandler = void 0;
const qrCodeService_1 = require("../services/qrCodeService");
const generateQRCodeHandler = async (req, res) => {
    try {
        const { assetId } = req.params;
        const qrCodePath = await (0, qrCodeService_1.generateQRCode)(assetId);
        res.status(200).json({
            success: true,
            data: {
                qrCodePath
            }
        });
    }
    catch (error) {
        console.error('Error generating QR code:', error);
        res.status(400).json({
            message: 'Failed to generate QR code',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.generateQRCodeHandler = generateQRCodeHandler;
const validateQRCodeHandler = async (req, res) => {
    try {
        const { qrData } = req.body;
        const validationResult = await (0, qrCodeService_1.validateQRCode)(qrData);
        res.status(200).json({
            success: true,
            data: validationResult
        });
    }
    catch (error) {
        console.error('Error validating QR code:', error);
        res.status(400).json({
            message: 'Invalid QR code',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.validateQRCodeHandler = validateQRCodeHandler;
const regenerateQRCodeHandler = async (req, res) => {
    try {
        const { assetId } = req.params;
        const qrCodePath = await (0, qrCodeService_1.regenerateQRCode)(assetId);
        res.status(200).json({
            success: true,
            data: {
                qrCodePath
            }
        });
    }
    catch (error) {
        console.error('Error regenerating QR code:', error);
        res.status(400).json({
            message: 'Failed to regenerate QR code',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.regenerateQRCodeHandler = regenerateQRCodeHandler;
const deactivateQRCodeHandler = async (req, res) => {
    try {
        const { assetId } = req.params;
        await (0, qrCodeService_1.deactivateQRCode)(assetId);
        res.status(200).json({
            success: true,
            message: 'QR code deactivated successfully'
        });
    }
    catch (error) {
        console.error('Error deactivating QR code:', error);
        res.status(400).json({
            message: 'Failed to deactivate QR code',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.deactivateQRCodeHandler = deactivateQRCodeHandler;
