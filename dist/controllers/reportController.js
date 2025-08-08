"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportReportHandler = exports.getReportHandler = void 0;
const reportService_1 = require("../services/reportService");
const getReportHandler = async (req, res) => {
    try {
        const { type, startDate, endDate, department } = req.query;
        let reportData;
        const startDateObj = startDate ? new Date(startDate) : undefined;
        const endDateObj = endDate ? new Date(endDate) : undefined;
        const departmentStr = department; // Cast to string explicitly
        switch (type) {
            case 'assetsByCategory':
                reportData = await (0, reportService_1.getAssetsByCategory)(startDateObj, endDateObj, departmentStr);
                break;
            case 'assetsByStatus':
                reportData = await (0, reportService_1.getAssetsByStatus)(startDateObj, endDateObj, departmentStr);
                break;
            case 'assetsByDepartment':
                reportData = await (0, reportService_1.getAssetsByDepartment)(startDateObj, endDateObj);
                break;
            case 'maintenanceHistory':
                reportData = await (0, reportService_1.getMaintenanceHistory)(startDateObj, endDateObj, departmentStr);
                break;
            case 'assetAcquisitions':
                reportData = await (0, reportService_1.getAssetAcquisitionReport)(startDateObj, endDateObj);
                break;
            case 'depreciationReport':
                reportData = await (0, reportService_1.getDepreciationReport)(undefined, undefined, departmentStr);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid report type'
                });
        }
        res.status(200).json({
            success: true,
            data: reportData
        });
    }
    catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({
            message: 'Failed to generate report',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.getReportHandler = getReportHandler;
const exportReportHandler = async (req, res) => {
    try {
        const { type, format, startDate, endDate, department } = req.query;
        // Implementation for exporting reports in different formats (CSV, PDF, etc.)
        // This would typically generate a file and send it as a download
        res.status(200).json({
            success: true,
            message: 'Report export functionality would be implemented here'
        });
    }
    catch (error) {
        console.error('Error exporting report:', error);
        res.status(500).json({
            message: 'Failed to export report',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.exportReportHandler = exportReportHandler;
