import { accessTokenTtl, jwtAccessSecret, jwtRefreshSecret, refreshTokenTtl } from '../config/env';
import { RefreshToken } from '../models/RefreshToken';
import { AccessTokenPayload } from '../types/auth';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Roles } from '../models/User';
import { randomUUID } from 'crypto';

export async function createTokenPair(userId: string, userRole: Roles) {
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
