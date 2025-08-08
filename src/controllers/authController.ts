// src/controllers/authController.ts

import { RequestHandler } from 'express';
import {
  authenticateUser,
  issueRefreshToken,
  verifyAccessToken,
} from '../services/authService';

/**
 * POST /api/auth/login
 * Authenticate user and return JWT tokens
 */
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const tokens = await authenticateUser(username, password);
    // tokens: { accessToken: string; refreshToken: string; }
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Exchange refresh token for new access & refresh tokens
 */
export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken: oldToken } = req.body;
    const tokens = await issueRefreshToken(oldToken);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/validate
 * Validate provided access token
 */
export const validateToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const [, token] = authHeader.split(' ');
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    const isValid = await verifyAccessToken(token);
    res.json({ valid: isValid });
  } catch (error) {
    next(error);
  }
};
