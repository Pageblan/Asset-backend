"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const auditTrailMiddleware_1 = require("./middleware/auditTrailMiddleware");
const assetUtilizationRoutes_1 = __importDefault(require("./routes/assetUtilizationRoutes"));
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const departmentRoutes_1 = __importDefault(require("./routes/departmentRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const assetRoutes_1 = __importDefault(require("./routes/assetRoutes"));
const assignmentRoutes_1 = __importDefault(require("./routes/assignmentRoutes"));
const maintenanceRoutes_1 = __importDefault(require("./routes/maintenanceRoutes"));
const qrTagRoutes_1 = __importDefault(require("./routes/qrTagRoutes"));
// Load environment variables
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Apply audit trail middleware to all routes except auth
app.use(/^(?!\/api\/auth).*$/, auditTrailMiddleware_1.auditTrailMiddleware);
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/departments', departmentRoutes_1.default);
app.use('/api/requests', requestRoutes_1.default);
app.use('/api/assets', assetRoutes_1.default);
app.use('/api/assignments', assignmentRoutes_1.default);
app.use('/api/maintenance', maintenanceRoutes_1.default);
app.use('/api/qr-tags', qrTagRoutes_1.default);
app.use('/api/reports', assetUtilizationRoutes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});
// Initialize database connection
database_1.AppDataSource.initialize()
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
exports.default = app;
