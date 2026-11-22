import { accessTokenTtl, jwtAccessSecret, jwtRefreshSecret, refreshTokenTtl } from '../config/env';
import { RefreshToken } from '../models/refreshToken.model';
import { AccessTokenPayload, Role } from '../types/auth';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomUUID } from 'crypto';

export async function createTokenPair(userId: string, userRole: Role) {
    const payload: AccessTokenPayload = { sub: userId, role: userRole };
    const accessToken = jwt.sign(payload, jwtAccessSecret, { expiresIn: accessTokenTtl });

    const refreshToken = jwt.sign({ sub: userId, jti: randomUUID() }, jwtRefreshSecret, { expiresIn: refreshTokenTtl });
    const { exp } = jwt.decode(refreshToken) as JwtPayload;
    if (!exp) throw new Error('Refresh token has no exp');

    const expiresAt = exp * 1000;
    await RefreshToken.create({
        userId,
        token: refreshToken,
        expiresAt: new Date(expiresAt),
    });

    return { accessToken, refreshToken, refreshTokenExpiresAt: expiresAt };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, jwtAccessSecret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, jwtRefreshSecret) as JwtPayload;
}
