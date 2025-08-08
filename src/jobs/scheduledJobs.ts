import cron from 'node-cron';
import { runDepreciationJob } from '../services/assetService';
import { getUpcomingMaintenance } from '../services/maintenanceService';
import { sendMaintenanceNotifications } from '../services/notificationService';

/**
 * Initialize scheduled jobs
 */
export const initializeScheduledJobs = (): void => {
    // Run depreciation calculation daily at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily depreciation calculation job...');
        try {
            await runDepreciationJob();
            console.log('Depreciation calculation job completed successfully');
        } catch (error) {
            console.error('Error running depreciation calculation job:', error);
        }
    });

    // Send maintenance notifications daily at 8 AM
    cron.schedule('0 8 * * *', async () => {
        console.log('Running daily maintenance notification job...');
        try {
            // Get upcoming maintenance for the next 7 days
            const upcomingMaintenance = await getUpcomingMaintenance(7);
            
            // Send notifications
            await sendMaintenanceNotifications(upcomingMaintenance);
            
            console.log(`Maintenance notifications sent for ${upcomingMaintenance.length} upcoming maintenance tasks`);
        } catch (error) {
            console.error('Error running maintenance notification job:', error);
        }
    });
};