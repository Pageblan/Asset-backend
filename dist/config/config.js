"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    keycloak: {
        url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
        realm: process.env.KEYCLOAK_REALM || 'my-app',
        clientId: process.env.KEYCLOAK_CLIENT_ID || 'asset-management-client',
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || 'your-client-secret'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
        expiration: parseInt(process.env.JWT_EXPIRATION || '3600')
    }
};
