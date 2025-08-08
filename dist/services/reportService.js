"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaintenanceHistory = exports.exportMaintenanceToCSV = exports.exportAssetsToCSV = exports.getAssetAcquisitionReport = exports.getDepreciationReport = exports.getMaintenanceStatistics = exports.getAssetsByDepartment = exports.getAssetsByStatus = exports.getAssetsByCategory = void 0;
const database_1 = require("../config/database");
const Asset_1 = require("../entities/Asset");
const Maintenance_1 = require("../entities/Maintenance");
/**
 * Get assets grouped by category
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @param departmentId Optional department filter
 * @returns Assets grouped by category
 */
const getAssetsByCategory = async (startDate, endDate, departmentId) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Build query
    let query = assetRepository.createQueryBuilder('asset')
        .select('asset.category', 'category')
        .addSelect('COUNT(asset.id)', 'count')
        .addSelect('SUM(asset.initial_value)', 'totalValue')
        .addSelect('SUM(asset.current_value)', 'currentValue');
    // Apply filters
    if (startDate) {
        query = query.andWhere('asset.date_received >= :startDate', { startDate });
    }
    if (endDate) {
        query = query.andWhere('asset.date_received <= :endDate', { endDate });
    }
    if (departmentId && departmentId !== 'all') {
        query = query.andWhere('asset.department_id = :departmentId', { departmentId });
    }
    // Group by category
    query = query.groupBy('asset.category');
    // Execute query
    const result = await query.getRawMany();
    // Calculate totals
    const totalCount = result.reduce((sum, item) => sum + parseInt(item.count), 0);
    const totalInitialValue = result.reduce((sum, item) => sum + parseFloat(item.totalValue), 0);
    const totalCurrentValue = result.reduce((sum, item) => sum + parseFloat(item.currentValue), 0);
    return {
        categories: result,
        summary: {
            totalCount,
            totalInitialValue,
            totalCurrentValue,
            totalDepreciation: totalInitialValue - totalCurrentValue
        }
    };
};
exports.getAssetsByCategory = getAssetsByCategory;
/**
 * Get assets grouped by status
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @param departmentId Optional department filter
 * @returns Assets grouped by status
 */
const getAssetsByStatus = async (startDate, endDate, departmentId) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Build query
    let query = assetRepository.createQueryBuilder('asset')
        .select('asset.status', 'status')
        .addSelect('COUNT(asset.id)', 'count')
        .addSelect('SUM(asset.initial_value)', 'totalValue')
        .addSelect('SUM(asset.current_value)', 'currentValue');
    // Apply filters
    if (startDate) {
        query = query.andWhere('asset.date_received >= :startDate', { startDate });
    }
    if (endDate) {
        query = query.andWhere('asset.date_received <= :endDate', { endDate });
    }
    if (departmentId && departmentId !== 'all') {
        query = query.andWhere('asset.department_id = :departmentId', { departmentId });
    }
    // Group by status
    query = query.groupBy('asset.status');
    // Execute query
    const result = await query.getRawMany();
    return {
        statuses: result,
        summary: {
            totalCount: result.reduce((sum, item) => sum + parseInt(item.count), 0),
            totalValue: result.reduce((sum, item) => sum + parseFloat(item.totalValue), 0),
            totalCurrentValue: result.reduce((sum, item) => sum + parseFloat(item.currentValue), 0)
        }
    };
};
exports.getAssetsByStatus = getAssetsByStatus;
/**
 * Get assets grouped by department
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @returns Assets grouped by department
 */
const getAssetsByDepartment = async (startDate, endDate) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Build query
    let query = assetRepository.createQueryBuilder('asset')
        .leftJoin('asset.department', 'department')
        .select('department.id', 'departmentId')
        .addSelect('department.name', 'departmentName')
        .addSelect('COUNT(asset.id)', 'count')
        .addSelect('SUM(asset.initial_value)', 'totalValue')
        .addSelect('SUM(asset.current_value)', 'currentValue');
    // Apply filters
    if (startDate) {
        query = query.andWhere('asset.date_received >= :startDate', { startDate });
    }
    if (endDate) {
        query = query.andWhere('asset.date_received <= :endDate', { endDate });
    }
    // Group by department
    query = query.groupBy('department.id').addGroupBy('department.name');
    // Execute query
    const result = await query.getRawMany();
    return {
        departments: result,
        summary: {
            totalCount: result.reduce((sum, item) => sum + parseInt(item.count), 0),
            totalValue: result.reduce((sum, item) => sum + parseFloat(item.totalValue), 0),
            totalCurrentValue: result.reduce((sum, item) => sum + parseFloat(item.currentValue), 0)
        }
    };
};
exports.getAssetsByDepartment = getAssetsByDepartment;
/**
 * Get maintenance statistics
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @param departmentId Optional department filter
 * @returns Maintenance statistics
 */
const getMaintenanceStatistics = async (startDate, endDate, departmentId) => {
    var _a, _b, _c;
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    // Build query for maintenance by status
    let statusQuery = maintenanceRepository.createQueryBuilder('maintenance')
        .leftJoin('maintenance.asset', 'asset')
        .select('maintenance.status', 'status')
        .addSelect('COUNT(maintenance.id)', 'count');
    // Apply filters
    if (startDate) {
        statusQuery = statusQuery.andWhere('maintenance.scheduled_date >= :startDate', { startDate });
    }
    if (endDate) {
        statusQuery = statusQuery.andWhere('maintenance.scheduled_date <= :endDate', { endDate });
    }
    if (departmentId && departmentId !== 'all') {
        statusQuery = statusQuery.andWhere('asset.department_id = :departmentId', { departmentId });
    }
    // Group by status
    statusQuery = statusQuery.groupBy('maintenance.status');
    // Execute status query
    const statusResult = await statusQuery.getRawMany();
    // Build query for maintenance by type
    let typeQuery = maintenanceRepository.createQueryBuilder('maintenance')
        .leftJoin('maintenance.asset', 'asset')
        .select('maintenance.type', 'type')
        .addSelect('COUNT(maintenance.id)', 'count');
    // Apply filters
    if (startDate) {
        typeQuery = typeQuery.andWhere('maintenance.scheduled_date >= :startDate', { startDate });
    }
    if (endDate) {
        typeQuery = typeQuery.andWhere('maintenance.scheduled_date <= :endDate', { endDate });
    }
    if (departmentId && departmentId !== 'all') {
        typeQuery = typeQuery.andWhere('asset.department_id = :departmentId', { departmentId });
    }
    // Group by type
    typeQuery = typeQuery.groupBy('maintenance.type');
    // Execute type query
    const typeResult = await typeQuery.getRawMany();
    // Calculate upcoming maintenance
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    let upcomingQuery = maintenanceRepository.createQueryBuilder('maintenance')
        .leftJoin('maintenance.asset', 'asset')
        .leftJoin('asset.department', 'department')
        .select('maintenance.id', 'id')
        .addSelect('maintenance.scheduled_date', 'scheduledDate')
        .addSelect('maintenance.type', 'type')
        .addSelect('asset.name', 'assetName')
        .addSelect('department.name', 'departmentName')
        .where('maintenance.status = :status', { status: 'scheduled' })
        .andWhere('maintenance.scheduled_date BETWEEN :today AND :nextMonth', { today, nextMonth });
    if (departmentId && departmentId !== 'all') {
        upcomingQuery = upcomingQuery.andWhere('asset.department_id = :departmentId', { departmentId });
    }
    upcomingQuery = upcomingQuery.orderBy('maintenance.scheduled_date', 'ASC');
    // Execute upcoming query
    const upcomingResult = await upcomingQuery.getRawMany();
    return {
        byStatus: statusResult,
        byType: typeResult,
        upcoming: upcomingResult,
        summary: {
            total: statusResult.reduce((sum, item) => sum + parseInt(item.count), 0),
            completed: ((_a = statusResult.find(item => item.status === 'completed')) === null || _a === void 0 ? void 0 : _a.count) || 0,
            scheduled: ((_b = statusResult.find(item => item.status === 'scheduled')) === null || _b === void 0 ? void 0 : _b.count) || 0,
            overdue: ((_c = statusResult.find(item => item.status === 'overdue')) === null || _c === void 0 ? void 0 : _c.count) || 0
        }
    };
};
exports.getMaintenanceStatistics = getMaintenanceStatistics;
/**
 * Get depreciation report
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @param departmentId Optional department filter
 * @returns Depreciation report
 */
const getDepreciationReport = async (startDate, endDate, departmentId) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Build query
    let query = assetRepository.createQueryBuilder('asset')
        .leftJoin('asset.department', 'department')
        .select('asset.id', 'id')
        .addSelect('asset.name', 'name')
        .addSelect('asset.asset_id', 'assetId')
        .addSelect('asset.category', 'category')
        .addSelect('department.name', 'departmentName')
        .addSelect('asset.initial_value', 'initialValue')
        .addSelect('asset.current_value', 'currentValue')
        .addSelect('asset.date_received', 'dateReceived')
        .addSelect('asset.useful_life_years', 'usefulLifeYears')
        .addSelect('asset.depreciation_rate', 'depreciationRate');
    // Apply filters
    if (startDate) {
        query = query.andWhere('asset.date_received >= :startDate', { startDate });
    }
    if (endDate) {
        query = query.andWhere('asset.date_received <= :endDate', { endDate });
    }
    if (departmentId && departmentId !== 'all') {
        query = query.andWhere('asset.department_id = :departmentId', { departmentId });
    }
    // Execute query
    const assets = await query.getRawMany();
    // Calculate depreciation for each asset
    const assetsWithDepreciation = assets.map(asset => {
        const depreciation = parseFloat(asset.initialValue) - parseFloat(asset.currentValue);
        const depreciationPercentage = (depreciation / parseFloat(asset.initialValue)) * 100;
        return {
            ...asset,
            depreciation,
            depreciationPercentage: depreciationPercentage.toFixed(2)
        };
    });
    // Calculate totals
    const totalInitialValue = assetsWithDepreciation.reduce((sum, asset) => sum + parseFloat(asset.initialValue), 0);
    const totalCurrentValue = assetsWithDepreciation.reduce((sum, asset) => sum + parseFloat(asset.currentValue), 0);
    const totalDepreciation = totalInitialValue - totalCurrentValue;
    return {
        assets: assetsWithDepreciation,
        summary: {
            totalAssets: assetsWithDepreciation.length,
            totalInitialValue,
            totalCurrentValue,
            totalDepreciation,
            averageDepreciationPercentage: assetsWithDepreciation.length > 0
                ? ((totalDepreciation / totalInitialValue) * 100).toFixed(2)
                : 0
        }
    };
};
exports.getDepreciationReport = getDepreciationReport;
/**
 * Get asset acquisition report
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @returns Asset acquisition report grouped by month
 */
const getAssetAcquisitionReport = async (startDate, endDate) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Set default date range if not provided
    if (!startDate) {
        // Default to 1 year ago
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
    }
    if (!endDate) {
        endDate = new Date();
    }
    // Build query
    const query = assetRepository.createQueryBuilder('asset')
        .select("DATE_TRUNC('month', asset.date_received)", 'month')
        .addSelect('COUNT(asset.id)', 'count')
        .addSelect('SUM(asset.initial_value)', 'totalValue')
        .where('asset.date_received BETWEEN :startDate AND :endDate', { startDate, endDate })
        .groupBy("DATE_TRUNC('month', asset.date_received)")
        .orderBy("DATE_TRUNC('month', asset.date_received)", 'ASC');
    // Execute query
    const result = await query.getRawMany();
    // Format the results
    const formattedResult = result.map(item => ({
        month: new Date(item.month).toISOString().substring(0, 7), // Format as YYYY-MM
        count: parseInt(item.count),
        totalValue: parseFloat(item.totalValue)
    }));
    return {
        acquisitions: formattedResult,
        summary: {
            totalCount: formattedResult.reduce((sum, item) => sum + item.count, 0),
            totalValue: formattedResult.reduce((sum, item) => sum + item.totalValue, 0),
            averagePerMonth: formattedResult.length > 0
                ? (formattedResult.reduce((sum, item) => sum + item.count, 0) / formattedResult.length).toFixed(2)
                : 0
        }
    };
};
exports.getAssetAcquisitionReport = getAssetAcquisitionReport;
/**
 * Export assets report to CSV format
 * @param departmentId Optional department filter
 * @returns CSV string of assets data
 */
const exportAssetsToCSV = async (departmentId) => {
    const assetRepository = database_1.AppDataSource.getRepository(Asset_1.Asset);
    // Build query
    let query = assetRepository.createQueryBuilder('asset')
        .leftJoin('asset.department', 'department')
        .select('asset.asset_id', 'Asset ID')
        .addSelect('asset.name', 'Asset Name')
        .addSelect('asset.category', 'Category')
        .addSelect('asset.model', 'Model')
        .addSelect('asset.serial_number', 'Serial Number')
        .addSelect('department.name', 'Department')
        .addSelect('asset.status', 'Status')
        .addSelect('asset.initial_value', 'Initial Value')
        .addSelect('asset.current_value', 'Current Value')
        .addSelect('asset.date_received', 'Date Received')
        .addSelect('asset.useful_life_years', 'Useful Life (Years)')
        .addSelect('asset.notes', 'Notes');
    // Apply department filter if provided
    if (departmentId && departmentId !== 'all') {
        query = query.where('asset.department_id = :departmentId', { departmentId });
    }
    // Execute query
    const assets = await query.getRawMany();
    // Convert to CSV
    if (assets.length === 0) {
        return 'No assets found';
    }
    // Get headers from the first asset
    const headers = Object.keys(assets[0]);
    // Create CSV header row
    let csv = headers.join(',') + '\n';
    // Add data rows
    assets.forEach(asset => {
        const row = headers.map(header => {
            const value = asset[header];
            // Handle values that might contain commas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += row.join(',') + '\n';
    });
    return csv;
};
exports.exportAssetsToCSV = exportAssetsToCSV;
/**
 * Export maintenance report to CSV format
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @param departmentId Optional department filter
 * @returns CSV string of maintenance data
 */
const exportMaintenanceToCSV = async (startDate, endDate, departmentId) => {
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    // Build query
    let query = maintenanceRepository.createQueryBuilder('maintenance')
        .leftJoin('maintenance.asset', 'asset')
        .leftJoin('asset.department', 'department')
        .select('maintenance.id', 'Maintenance ID')
        .addSelect('asset.asset_id', 'Asset ID')
        .addSelect('asset.name', 'Asset Name')
        .addSelect('department.name', 'Department')
        .addSelect('maintenance.type', 'Maintenance Type')
        .addSelect('maintenance.description', 'Description')
        .addSelect('maintenance.scheduled_date', 'Scheduled Date')
        .addSelect('maintenance.completed_date', 'Completed Date')
        .addSelect('maintenance.status', 'Status')
        .addSelect('maintenance.cost', 'Cost')
        .addSelect('maintenance.performed_by', 'Performed By')
        .addSelect('maintenance.notes', 'Notes');
    // Apply filters
    if (startDate) {
        query = query.andWhere('maintenance.scheduled_date >= :startDate', { startDate });
    }
    if (endDate) {
        query = query.andWhere('maintenance.scheduled_date <= :endDate', { endDate });
    }
    if (departmentId && departmentId !== 'all') {
        query = query.andWhere('asset.department_id = :departmentId', { departmentId });
    }
    // Execute query
    const maintenanceRecords = await query.getRawMany();
    // Convert to CSV
    if (maintenanceRecords.length === 0) {
        return 'No maintenance records found';
    }
    // Get headers from the first record
    const headers = Object.keys(maintenanceRecords[0]);
    // Create CSV header row
    let csv = headers.join(',') + '\n';
    // Add data rows
    maintenanceRecords.forEach(record => {
        const row = headers.map(header => {
            const value = record[header];
            // Handle values that might contain commas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += row.join(',') + '\n';
    });
    return csv;
};
exports.exportMaintenanceToCSV = exportMaintenanceToCSV;
/**
 * Get maintenance history for assets
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @param departmentId Optional department filter
 * @returns Maintenance history data
 */
const getMaintenanceHistory = async (startDate, endDate, departmentId) => {
    const maintenanceRepository = database_1.AppDataSource.getRepository(Maintenance_1.Maintenance);
    // Build query
    let query = maintenanceRepository.createQueryBuilder('maintenance')
        .leftJoin('maintenance.asset', 'asset')
        .leftJoin('asset.department', 'department')
        .select('maintenance.id', 'id')
        .addSelect('maintenance.type', 'type')
        .addSelect('maintenance.status', 'status')
        .addSelect('maintenance.scheduled_date', 'scheduledDate')
        .addSelect('maintenance.completed_date', 'completedDate')
        .addSelect('asset.name', 'assetName')
        .addSelect('asset.asset_id', 'assetId')
        .addSelect('department.name', 'departmentName');
    // Apply filters
    if (startDate) {
        query = query.andWhere('maintenance.scheduled_date >= :startDate', { startDate });
    }
    if (endDate) {
        query = query.andWhere('maintenance.scheduled_date <= :endDate', { endDate });
    }
    if (departmentId && departmentId !== 'all') {
        query = query.andWhere('asset.department_id = :departmentId', { departmentId });
    }
    // Order by scheduled date
    query = query.orderBy('maintenance.scheduled_date', 'DESC');
    // Execute query
    const maintenanceRecords = await query.getRawMany();
    return {
        records: maintenanceRecords,
        summary: {
            totalRecords: maintenanceRecords.length,
            completed: maintenanceRecords.filter(record => record.status === 'completed').length,
            pending: maintenanceRecords.filter(record => record.status === 'pending').length,
            scheduled: maintenanceRecords.filter(record => record.status === 'scheduled').length
        }
    };
};
exports.getMaintenanceHistory = getMaintenanceHistory;
