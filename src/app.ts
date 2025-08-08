import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { auditTrailMiddleware } from './middleware/auditTrailMiddleware';
import assetUtilizationRoutes from './routes/assetUtilizationRoutes';

// Import routes
import authRoutes from './routes/authRoutes';
import departmentRoutes from './routes/departmentRoutes';
import requestRoutes from './routes/requestRoutes';
import assetRoutes from './routes/assetRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import qrTagRoutes from './routes/qrTagRoutes';
import assetReportRoutes from './routes/assetReportRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply audit trail middleware to all routes except auth
app.use(/^(?!\/api\/auth).*$/, auditTrailMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/qr-tags', qrTagRoutes);
app.use('/api/reports', assetUtilizationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });

export default app;