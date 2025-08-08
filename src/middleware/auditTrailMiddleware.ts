import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuditTrail } from '../entities/AuditTrail';
import jwt from 'jsonwebtoken';

/**
 * Middleware to log all API actions for audit purposes
 */
export const auditTrailMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const originalJson = res.json;
  const originalEnd  = res.end;

  // 1. Extract user ID from Bearer token
  let userId = 'anonymous';
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token   = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
      userId = decoded.sub || decoded.id || 'anonymous';
    } catch (err) {
      console.error('Error decoding JWT token:', err);
    }
  }

  // 2. Derive entityType and entityId from URL path
  const segments   = req.path.split('/').filter(Boolean);
  const entityType = segments[1]?.toUpperCase() || 'UNKNOWN';
  const entityId   = segments[2] || 'UNKNOWN';

  // 3. Map HTTP method to action
  const actionMap: Record<string, string> = {
    GET:    'READ',
    POST:   'CREATE',
    PUT:    'UPDATE',
    PATCH:  'UPDATE',
    DELETE: 'DELETE'
  };
  const action = actionMap[req.method] || 'UNKNOWN';

  // 4. Prepare AuditTrail entity
  const auditTrail = new AuditTrail();
  auditTrail.user_id      = userId;
  auditTrail.action       = action;
  auditTrail.entity_type  = entityType;
  auditTrail.entity_id    = entityId;
  auditTrail.resource     = req.originalUrl;
  auditTrail.ip_address   = req.ip || 'unknown';
  auditTrail.user_agent   = req.headers['user-agent'] || 'unknown';
  auditTrail.request_data = JSON.stringify({
    body:   req.body,
    params: req.params,
    query:  req.query
  });

  // 5. Override res.json to capture JSON responses
  res.json = function (this: Response, body: any): Response {
    auditTrail.response_data = JSON.stringify(body);
    auditTrail.status_code   = this.statusCode;
    auditTrail.new_values    = ['POST','PUT','PATCH'].includes(req.method) ? body : null;

    AppDataSource.getRepository(AuditTrail)
      .save(auditTrail)
      .catch(err => console.error('Error saving audit trail:', err));

    return originalJson.call(this, body);
  };

  // 6. Override res.end with rest-parameters and cast the original
  res.end = function (this: Response, ...args: any[]): Response {
    // If res.json wasn’t called, capture non-JSON response
    if (!auditTrail.response_data) {
      const chunk = args[0];
      auditTrail.response_data = chunk ? chunk.toString() : '';
      auditTrail.status_code   = this.statusCode;

      AppDataSource.getRepository(AuditTrail)
        .save(auditTrail)
        .catch(err => console.error('Error saving audit trail:', err));
    }

    // Cast originalEnd to variadic to satisfy TS signature
    const variadicEnd = originalEnd as unknown as (...innerArgs: any[]) => Response;
    return variadicEnd.apply(this, args);
  };

  next();
};
