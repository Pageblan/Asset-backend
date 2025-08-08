"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditMiddleware = void 0;
const database_1 = require("../config/database");
const AuditLog_1 = require("../entities/AuditLog");
/**
 * Middleware to log all changes with user and timestamp
 * @param entityType Type of entity being modified
 */
const auditMiddleware = (entityType) => {
    return async (req, res, next) => {
        // Store the original send function
        const originalSend = res.send;
        // Override the send function
        res.send = function (body) {
            var _a, _b;
            // Only log for successful write operations
            const method = req.method;
            if ((method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') &&
                res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) || 'anonymous';
                    const entityId = req.params.id || (typeof body === 'string' ? (_b = JSON.parse(body)) === null || _b === void 0 ? void 0 : _b.id : body === null || body === void 0 ? void 0 : body.id);
                    const action = getActionFromMethod(method);
                    // Create audit log
                    const auditLogRepository = database_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
                    const auditLog = new AuditLog_1.AuditLog();
                    auditLog.user_id = userId;
                    auditLog.entity_type = entityType;
                    auditLog.entity_id = entityId;
                    auditLog.action = action;
                    auditLog.old_values = req.body.oldValues || null;
                    auditLog.new_values = req.body.newValues || req.body || null;
                    auditLog.ip_address = req.ip;
                    // Save audit log asynchronously (don't wait for it)
                    auditLogRepository.save(auditLog)
                        .catch(error => console.error('Error saving audit log:', error));
                }
                catch (error) {
                    console.error('Error in audit middleware:', error);
                }
            }
            // Call the original send function
            return originalSend.call(this, body);
        };
        next();
    };
};
exports.auditMiddleware = auditMiddleware;
/**
 * Get action type from HTTP method
 * @param method HTTP method
 * @returns Action type
 */
const getActionFromMethod = (method) => {
    switch (method) {
        case 'POST':
            return 'create';
        case 'PUT':
        case 'PATCH':
            return 'update';
        case 'DELETE':
            return 'delete';
        default:
            return 'unknown';
    }
};
