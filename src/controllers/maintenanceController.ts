// src/controllers/maintenanceController.ts

import { RequestHandler } from 'express';
import {
  scheduleMaintenance,
  getMaintenanceById,
  getMaintenanceByAssetId,
  getUpcomingMaintenance,
  updateMaintenance,
  completeMaintenance,
  cancelMaintenance,
} from '../services/maintenanceService';

// POST /api/maintenance/asset/:assetId
export const scheduleMaintenanceHandler: RequestHandler = async (req, res, next) => {
  try {
    const { assetId } = req.params;
    // Expecting service signature: scheduleMaintenance(assetId: string, details: object)
    const details = {
      maintenance_type: req.body.maintenance_type,
      scheduled_date: req.body.scheduled_date,
      description: req.body.description,
    };
    const record = await scheduleMaintenance(assetId, details);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

// GET /api/maintenance/:id
export const getMaintenanceByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await getMaintenanceById(id);
    if (!record) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
};

// GET /api/maintenance/asset/:assetId
export const getMaintenanceByAssetIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { assetId } = req.params;
    const records = await getMaintenanceByAssetId(assetId);
    res.json(records);
  } catch (err) {
    next(err);
  }
};

// GET /api/maintenance/upcoming
export const getUpcomingMaintenanceHandler: RequestHandler = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days as string, 10) || 30;
    const upcoming = await getUpcomingMaintenance(days);
    res.json(upcoming);
  } catch (err) {
    next(err);
  }
};

// PUT /api/maintenance/:id
export const updateMaintenanceHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Expecting service signature: updateMaintenance(id: string, updates: object)
    const updated = await updateMaintenance(id, updates);
    if (!updated) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// POST /api/maintenance/:id/complete
export const completeMaintenanceHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Expecting service signature: completeMaintenance(id: string, data: object)
    const data = {
      completion_date: req.body.completion_date,
      technician_id: req.body.technician_id,
      notes: req.body.notes,
      completion_type: req.body.completion_type,
    };
    const completed = await completeMaintenance(id, data);
    if (!completed) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }
    res.json(completed);
  } catch (err) {
    next(err);
  }
};

// POST /api/maintenance/:id/cancel
export const cancelMaintenanceHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Expecting service signature: cancelMaintenance(id: string, reason: string)
    const cancelled = await cancelMaintenance(id, req.body.reason);
    if (!cancelled) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }
    res.json(cancelled);
  } catch (err) {
    next(err);
  }
};