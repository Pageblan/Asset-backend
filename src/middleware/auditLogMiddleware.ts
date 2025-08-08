import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuditLog } from '../entities/AuditLog';

export const auditLogMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Store the original response methods
    const originalJson = res.json;
    const originalSend = res.send;

    // Get user ID from JWT token
    const authHeader = req.headers.authorization;
    let userId = 'anonymous';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // In a real app, you would decode the JWT token to get the user ID
        // For now, we'll just use a placeholder
        userId = 'user-from-token';
    }

    // Get the entity type from the URL path
    const urlParts = req.path.split('/');
    const entityType = urlParts[2] ? urlParts[2].toUpperCase() : 'UNKNOWN';
    
    // Get the entity ID if it exists in the URL
    const entityId = (urlParts[3] || 'UNKNOWN') as string;

    // Get the action based on the HTTP method
    const actionMap: { [key: string]: string } = {
        'GET': 'READ',
        'POST': 'CREATE',
        'PUT': 'UPDATE',
        'PATCH': 'UPDATE',
        'DELETE': 'DELETE'
    };
    const action = actionMap[req.method] || 'UNKNOWN';

    // Store the original request body for comparison
    const oldValues = req.method === 'PUT' || req.method === 'PATCH' ? req.body : null;

    // Override the response json method
    res.json = function(body) {
        // Create an audit log entry
        const auditLogRepository = AppDataSource.getRepository(AuditLog);
        const auditLog = new AuditLog();
        auditLog.user_id = userId;
        auditLog.entity_type = entityType;
        auditLog.entity_id = entityId;
        auditLog.action = action;
        auditLog.old_values = oldValues;
        auditLog.new_values = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' ? body : null;
        auditLog.ip_address = req.ip as string;

        // Save the audit log asynchronously
        auditLogRepository.save(auditLog)
            .catch(error => console.error('Error saving audit log:', error));

        // Call the original method
        return originalJson.call(this, body);
    };

    // Override the response send method
    res.send = function(body) {
        // Call the original method
        return originalSend.call(this, body);
    };

    next();
};