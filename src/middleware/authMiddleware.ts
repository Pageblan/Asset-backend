/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { config } from '../config/config';

/**
 * Middleware to validate JWT token
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authorization token required' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Validate token with Keycloak
        const introspectEndpoint = `${config.keycloak.url}/realms/${config.keycloak.realm}/protocol/openid-connect/token/introspect`;
        
        const params = new URLSearchParams();
        params.append('client_id', config.keycloak.clientId);
        params.append('client_secret', config.keycloak.clientSecret);
        params.append('token', token);

        const response = await axios.post(introspectEndpoint, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.data.active) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }

        // Decode token to get user info
        const decoded = jwt.decode(token);
        
        // Check if decoded is not null and has the required structure
        if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
            (req as any).user = decoded as { sub: string; [key: string]: any };
        } else {
            res.status(401).json({ message: 'Invalid token format' });
            return;
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};