"use strict";
// src/controllers/assetUtilizationController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetUtilizationReport = void 0;
const assetUtilizationService_1 = require("../services/assetUtilizationService");
const getAssetUtilizationReport = async (req, res, next) => {
    try {
        // Parse query parameters for date range (default to last 30 days)
        const startDate = req.query.startDate
            ? new Date(req.query.startDate)
            : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = req.query.endDate
            ? new Date(req.query.endDate)
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
        const utilizationRates = await (0, assetUtilizationService_1.getAssetUtilizationRates)(startDate, endDate);
        // Send JSON response
        res.json(utilizationRates);
    }
    catch (error) {
        console.error('Error fetching asset utilization report:', error);
        next(error);
    }
};
exports.getAssetUtilizationReport = getAssetUtilizationReport;
