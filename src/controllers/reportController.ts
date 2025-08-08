import { Request, Response } from 'express';
import { 
  getAssetsByCategory,
  getAssetsByStatus,
  getAssetsByDepartment,
  getMaintenanceHistory,
  getAssetAcquisitionReport,
  getDepreciationReport
} from '../services/reportService';

export const getReportHandler = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { type, startDate, endDate, department } = req.query;
    
    let reportData;
    const startDateObj = startDate ? new Date(startDate as string) : undefined;
    const endDateObj = endDate ? new Date(endDate as string) : undefined;
    const departmentStr = department as string;  // Cast to string explicitly
    
    switch (type) {
      case 'assetsByCategory':
        reportData = await getAssetsByCategory(startDateObj, endDateObj, departmentStr);
        break;
      case 'assetsByStatus':
        reportData = await getAssetsByStatus(startDateObj, endDateObj, departmentStr);
        break;
      case 'assetsByDepartment':
        reportData = await getAssetsByDepartment(startDateObj, endDateObj);
        break;
      case 'maintenanceHistory':
        reportData = await getMaintenanceHistory(
          startDateObj as Date | undefined, 
          endDateObj as Date | undefined, 
          departmentStr as string | undefined
        );
        break;
      case 'assetAcquisitions':
        reportData = await getAssetAcquisitionReport(startDateObj, endDateObj);
        break;
      case 'depreciationReport':
        reportData = await getDepreciationReport(undefined, undefined, departmentStr);
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
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      message: 'Failed to generate report', 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

export const exportReportHandler = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { type, format, startDate, endDate, department } = req.query;
    
    // Implementation for exporting reports in different formats (CSV, PDF, etc.)
    // This would typically generate a file and send it as a download
    
    res.status(200).json({
      success: true,
      message: 'Report export functionality would be implemented here'
    });
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ 
      message: 'Failed to export report', 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};