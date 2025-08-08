"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeScheduledJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const assetService_1 = require("../services/assetService");
const maintenanceService_1 = require("../services/maintenanceService");
const notificationService_1 = require("../services/notificationService");
/**
 * Initialize scheduled jobs
 */
const initializeScheduledJobs = () => {
    // Run depreciation calculation daily at midnight
    node_cron_1.default.schedule('0 0 * * *', async () => {
        console.log('Running daily depreciation calculation job...');
        try {
            await (0, assetService_1.runDepreciationJob)();
            console.log('Depreciation calculation job completed successfully');
        }
        catch (error) {
            console.error('Error running depreciation calculation job:', error);
        }
    });
    // Send maintenance notifications daily at 8 AM
    node_cron_1.default.schedule('0 8 * * *', async () => {
        console.log('Running daily maintenance notification job...');
        try {
            // Get upcoming maintenance for the next 7 days
            const upcomingMaintenance = await (0, maintenanceService_1.getUpcomingMaintenance)(7);
            // Send notifications
            await (0, notificationService_1.sendMaintenanceNotifications)(upcomingMaintenance);
            console.log(`Maintenance notifications sent for ${upcomingMaintenance.length} upcoming maintenance tasks`);
        }
        catch (error) {
            console.error('Error running maintenance notification job:', error);
        }
    });
};
exports.initializeScheduledJobs = initializeScheduledJobs;
