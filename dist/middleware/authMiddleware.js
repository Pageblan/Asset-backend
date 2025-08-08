"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
/**
 * Middleware to validate JWT token
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authorization token required' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Validate token with Keycloak
        const introspectEndpoint = `${config_1.config.keycloak.url}/realms/${config_1.config.keycloak.realm}/protocol/openid-connect/token/introspect`;
        const params = new URLSearchParams();
        params.append('client_id', config_1.config.keycloak.clientId);
        params.append('client_secret', config_1.config.keycloak.clientSecret);
        params.append('token', token);
        const response = await axios_1.default.post(introspectEndpoint, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (!response.data.active) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }
        // Decode token to get user info
        const decoded = jsonwebtoken_1.default.decode(token);
        // Check if decoded is not null and has the required structure
        if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
            req.user = decoded;
        }
        else {
            res.status(401).json({ message: 'Invalid token format' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
exports.authMiddleware = authMiddleware;
