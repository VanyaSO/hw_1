import { nodeEnv } from './env';
import type { CookieConfig } from '../types/cookies';

export const refreshTokenCookie: CookieConfig = {
    name: 'refreshToken',
    options: {
        httpOnly: true,
        secure: nodeEnv === 'production',
        sameSite: 'strict',
        path: '/api/auth',
    },
};
