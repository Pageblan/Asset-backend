"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
/**
 * Middleware to check user roles
 * @param allowedRoles Array of allowed roles
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        var _a;
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            // Get user roles from token
            const userRoles = ((_a = req.user.realm_access) === null || _a === void 0 ? void 0 : _a.roles) || [];
            // Check if user has any of the allowed roles
            const hasRole = allowedRoles.some(role => userRoles.includes(role));
            if (!hasRole) {
                res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
                return;
            }
            next();
        }
        catch (error) {
            console.error('Role middleware error:', error);
            res.status(403).json({ message: 'Access forbidden' });
        }
    };
};
exports.roleMiddleware = roleMiddleware;
