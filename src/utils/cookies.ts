import type { Response } from 'express';
import type { CookieConfig } from '../types/cookies';

export function setCookie(res: Response, cookie: CookieConfig, value: string, maxAge: number) {
    res.cookie(cookie.name, value, { ...cookie.options, maxAge });
}

export function clearCookie(res: Response, cookie: CookieConfig) {
    res.clearCookie(cookie.name, cookie.options);
}
