import dotenv from 'dotenv';

dotenv.config();

export const config = {
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