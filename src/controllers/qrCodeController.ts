import { Request, Response } from 'express';
import { 
  generateQRCode, 
  validateQRCode, 
  regenerateQRCode, 
  deactivateQRCode 
} from '../services/qrCodeService';

export const generateQRCodeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const qrCodePath = await generateQRCode(assetId);
    
    res.status(200).json({
      success: true,
      data: {
        qrCodePath
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(400).json({ 
      message: 'Failed to generate QR code', 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

export const validateQRCodeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrData } = req.body;
    const validationResult = await validateQRCode(qrData);
    
    res.status(200).json({
      success: true,
      data: validationResult
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(400).json({ 
      message: 'Invalid QR code', 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

export const regenerateQRCodeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const qrCodePath = await regenerateQRCode(assetId);
    
    res.status(200).json({
      success: true,
      data: {
        qrCodePath
      }
    });
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    res.status(400).json({ 
      message: 'Failed to regenerate QR code', 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

export const deactivateQRCodeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    await deactivateQRCode(assetId);
    
    res.status(200).json({
      success: true,
      message: 'QR code deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating QR code:', error);
    res.status(400).json({ 
      message: 'Failed to deactivate QR code', 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};