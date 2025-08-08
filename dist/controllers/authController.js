"use strict";
// src/controllers/authController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.refreshToken = exports.login = void 0;
const authService_1 = require("../services/authService");
/**
 * POST /api/auth/login
 * Authenticate user and return JWT tokens
 */
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const tokens = await (0, authService_1.authenticateUser)(username, password);
        // tokens: { accessToken: string; refreshToken: string; }
        res.json(tokens);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
/**
 * POST /api/auth/refresh
 * Exchange refresh token for new access & refresh tokens
 */
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: oldToken } = req.body;
        const tokens = await (0, authService_1.issueRefreshToken)(oldToken);
        res.json(tokens);
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
/**
 * GET /api/auth/validate
 * Validate provided access token
 */
const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization') || '';
        const [, token] = authHeader.split(' ');
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const isValid = await (0, authService_1.verifyAccessToken)(token);
        res.json({ valid: isValid });
    }
    catch (error) {
        next(error);
    }
};
exports.validateToken = validateToken;
