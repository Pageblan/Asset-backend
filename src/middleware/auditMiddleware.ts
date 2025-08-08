import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuditLog } from '../entities/AuditLog';

/**
 * Middleware to log all changes with user and timestamp
 * @param entityType Type of entity being modified
 */
export const auditMiddleware = (entityType: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // Store the original send function
        const originalSend = res.send;

        // Override the send function
        res.send = function (body): Response {
            // Only log for successful write operations
            const method = req.method;
            if ((method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') && 
                res.statusCode >= 200 && res.statusCode < 300) {
                
                try {
                    const userId = req.user?.sub || 'anonymous';
                    const entityId = req.params.id || (typeof body === 'string' ? JSON.parse(body)?.id : body?.id);
                    const action = getActionFromMethod(method);
                    
                    // Create audit log
                    const auditLogRepository = AppDataSource.getRepository(AuditLog);
                    const auditLog = new AuditLog();
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
                } catch (error) {
                    console.error('Error in audit middleware:', error);
                }
            }
            
            // Call the original send function
            return originalSend.call(this, body);
        };
        
        next();
    };
};

/**
 * Get action type from HTTP method
 * @param method HTTP method
 * @returns Action type
 */
const getActionFromMethod = (method: string): string => {
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