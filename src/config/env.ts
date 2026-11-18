import 'dotenv/config';
import type { SignOptions } from 'jsonwebtoken';

export const port = Number(process.env.PORT) || 3000;
export const nodeEnv = process.env.NODE_ENV || 'development';
export const accessTokenTtl = (process.env.ACCESS_TOKEN_TTL || '15m') as SignOptions['expiresIn'];
export const refreshTokenTtl = (process.env.REFRESH_TOKEN_TTL || '7d') as SignOptions['expiresIn'];

export const mongodbUri = process.env.MONGODB_URI as string;
if (!mongodbUri) throw new Error('Environment: MONGODB_URI not found');

export const jwtAccessSecret = process.env.JWT_ACCESS_SECRET as string;
if (!jwtAccessSecret) throw new Error('Environment: JWT_ACCESS_SECRET not found');

export const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET as string;
if (!jwtRefreshSecret) throw new Error('Environment: JWT_REFRESH_SECRET not found');

export const adminEmail = process.env.ADMIN_EMAIL;
export const adminPassword = process.env.ADMIN_PASSWORD;
