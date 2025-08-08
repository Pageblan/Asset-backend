// src/controllers/assetUtilizationController.ts

import { RequestHandler } from 'express';
import { getAssetUtilizationRates } from '../services/assetUtilizationService';

export const getAssetUtilizationReport: RequestHandler = async (req, res, next) => {
  try {
    // Parse query parameters for date range (default to last 30 days)
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    // Validate date formats
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    // Ensure startDate is before endDate
    if (startDate > endDate) {
      res.status(400).json({ message: 'Start date must be before end date' });
      return;
    }

    // Fetch data from service
    const utilizationRates = await getAssetUtilizationRates(startDate, endDate);

    // Send JSON response
    res.json(utilizationRates);
  } catch (error: any) {
    console.error('Error fetching asset utilization report:', error);
    next(error);
  }
};
