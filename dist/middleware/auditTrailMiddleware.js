"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditTrailMiddleware = void 0;
const database_1 = require("../config/database");
const AuditTrail_1 = require("../entities/AuditTrail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware to log all API actions for audit purposes
 */
const auditTrailMiddleware = async (req, res, next) => {
    var _a;
    const originalJson = res.json;
    const originalEnd = res.end;
    // 1. Extract user ID from Bearer token
    let userId = 'anonymous';
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
            userId = decoded.sub || decoded.id || 'anonymous';
        }
        catch (err) {
            console.error('Error decoding JWT token:', err);
        }
    }
    // 2. Derive entityType and entityId from URL path
    const segments = req.path.split('/').filter(Boolean);
    const entityType = ((_a = segments[1]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'UNKNOWN';
    const entityId = segments[2] || 'UNKNOWN';
    // 3. Map HTTP method to action
    const actionMap = {
        GET: 'READ',
        POST: 'CREATE',
        PUT: 'UPDATE',
        PATCH: 'UPDATE',
        DELETE: 'DELETE'
    };
    const action = actionMap[req.method] || 'UNKNOWN';
    // 4. Prepare AuditTrail entity
    const auditTrail = new AuditTrail_1.AuditTrail();
    auditTrail.user_id = userId;
    auditTrail.action = action;
    auditTrail.entity_type = entityType;
    auditTrail.entity_id = entityId;
    auditTrail.resource = req.originalUrl;
    auditTrail.ip_address = req.ip || 'unknown';
    auditTrail.user_agent = req.headers['user-agent'] || 'unknown';
    auditTrail.request_data = JSON.stringify({
        body: req.body,
        params: req.params,
        query: req.query
    });
    // 5. Override res.json to capture JSON responses
    res.json = function (body) {
        auditTrail.response_data = JSON.stringify(body);
        auditTrail.status_code = this.statusCode;
        auditTrail.new_values = ['POST', 'PUT', 'PATCH'].includes(req.method) ? body : null;
        database_1.AppDataSource.getRepository(AuditTrail_1.AuditTrail)
            .save(auditTrail)
            .catch(err => console.error('Error saving audit trail:', err));
        return originalJson.call(this, body);
    };
    // 6. Override res.end with rest-parameters and cast the original
    res.end = function (...args) {
        // If res.json wasn’t called, capture non-JSON response
        if (!auditTrail.response_data) {
            const chunk = args[0];
            auditTrail.response_data = chunk ? chunk.toString() : '';
            auditTrail.status_code = this.statusCode;
            database_1.AppDataSource.getRepository(AuditTrail_1.AuditTrail)
                .save(auditTrail)
                .catch(err => console.error('Error saving audit trail:', err));
        }
        // Cast originalEnd to variadic to satisfy TS signature
        const variadicEnd = originalEnd;
        return variadicEnd.apply(this, args);
    };
    next();
};
exports.auditTrailMiddleware = auditTrailMiddleware;
