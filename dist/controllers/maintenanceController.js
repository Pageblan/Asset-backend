"use strict";
// src/controllers/maintenanceController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelMaintenanceHandler = exports.completeMaintenanceHandler = exports.updateMaintenanceHandler = exports.getUpcomingMaintenanceHandler = exports.getMaintenanceByAssetIdHandler = exports.getMaintenanceByIdHandler = exports.scheduleMaintenanceHandler = void 0;
const maintenanceService_1 = require("../services/maintenanceService");
// POST /api/maintenance/asset/:assetId
const scheduleMaintenanceHandler = async (req, res, next) => {
    try {
        const { assetId } = req.params;
        // Expecting service signature: scheduleMaintenance(assetId: string, details: object)
        const details = {
            maintenance_type: req.body.maintenance_type,
            scheduled_date: req.body.scheduled_date,
            description: req.body.description,
        };
        const record = await (0, maintenanceService_1.scheduleMaintenance)(assetId, details);
        res.status(201).json(record);
    }
    catch (err) {
        next(err);
    }
};
exports.scheduleMaintenanceHandler = scheduleMaintenanceHandler;
// GET /api/maintenance/:id
const getMaintenanceByIdHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const record = await (0, maintenanceService_1.getMaintenanceById)(id);
        if (!record) {
            res.status(404).json({ message: 'Maintenance record not found' });
            return;
        }
        res.json(record);
    }
    catch (err) {
        next(err);
    }
};
exports.getMaintenanceByIdHandler = getMaintenanceByIdHandler;
// GET /api/maintenance/asset/:assetId
const getMaintenanceByAssetIdHandler = async (req, res, next) => {
    try {
        const { assetId } = req.params;
        const records = await (0, maintenanceService_1.getMaintenanceByAssetId)(assetId);
        res.json(records);
    }
    catch (err) {
        next(err);
    }
};
exports.getMaintenanceByAssetIdHandler = getMaintenanceByAssetIdHandler;
// GET /api/maintenance/upcoming
const getUpcomingMaintenanceHandler = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days, 10) || 30;
        const upcoming = await (0, maintenanceService_1.getUpcomingMaintenance)(days);
        res.json(upcoming);
    }
    catch (err) {
        next(err);
    }
};
exports.getUpcomingMaintenanceHandler = getUpcomingMaintenanceHandler;
// PUT /api/maintenance/:id
const updateMaintenanceHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Expecting service signature: updateMaintenance(id: string, updates: object)
        const updated = await (0, maintenanceService_1.updateMaintenance)(id, updates);
        if (!updated) {
            res.status(404).json({ message: 'Maintenance record not found' });
            return;
        }
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
};
exports.updateMaintenanceHandler = updateMaintenanceHandler;
// POST /api/maintenance/:id/complete
const completeMaintenanceHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Expecting service signature: completeMaintenance(id: string, data: object)
        const data = {
            completion_date: req.body.completion_date,
            technician_id: req.body.technician_id,
            notes: req.body.notes,
            completion_type: req.body.completion_type,
        };
        const completed = await (0, maintenanceService_1.completeMaintenance)(id, data);
        if (!completed) {
            res.status(404).json({ message: 'Maintenance record not found' });
            return;
        }
        res.json(completed);
    }
    catch (err) {
        next(err);
    }
};
exports.completeMaintenanceHandler = completeMaintenanceHandler;
// POST /api/maintenance/:id/cancel
const cancelMaintenanceHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Expecting service signature: cancelMaintenance(id: string, reason: string)
        const cancelled = await (0, maintenanceService_1.cancelMaintenance)(id, req.body.reason);
        if (!cancelled) {
            res.status(404).json({ message: 'Maintenance record not found' });
            return;
        }
        res.json(cancelled);
    }
    catch (err) {
        next(err);
    }
};
exports.cancelMaintenanceHandler = cancelMaintenanceHandler;
