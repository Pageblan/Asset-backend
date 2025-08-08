import { Request, Response } from 'express';
import { getAssetsByStatus } from '../services/assetReportService';

export const getAssetsByStatusReport = async (req: Request, res: Response) => {
  try {
    const data = await getAssetsByStatus();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ... existing code ...