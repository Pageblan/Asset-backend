import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check user roles
 * @param allowedRoles Array of allowed roles
 */
export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }

            // Get user roles from token
            const userRoles = req.user.realm_access?.roles || [];

            // Check if user has any of the allowed roles
            const hasRole = allowedRoles.some(role => userRoles.includes(role));

            if (!hasRole) {
                res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
                return;
            }

            next();
        } catch (error) {
            console.error('Role middleware error:', error);
            res.status(403).json({ message: 'Access forbidden' });
        }
    };
};