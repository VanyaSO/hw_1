import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { RefreshToken } from '../models/refreshToken.model';
import { hashPassword, verifyPassword } from '../utils/password';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { refreshTokenCookie } from '../config/cookies';
import { createTokenPair, verifyRefreshToken } from '../utils/tokens';
import { setCookie, clearCookie } from '../utils/cookies';
import { LoginDto, RegisterDto } from '../types/auth';

export async function register(req: Request<{}, unknown, RegisterDto>, res: Response) {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    try {
        const user = await User.create({ email: email, password: hashedPassword });
        return res.status(201).json(user);
    } catch (err) {
        if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        throw err;
    }
}

export async function login(req: Request<{}, unknown, LoginDto>, res: Response) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken, refreshTokenExpiresAt } = await createTokenPair(user.id, user.role);

    setCookie(res, refreshTokenCookie, refreshToken, refreshTokenExpiresAt - Date.now());
    res.json({ accessToken });
}

export async function getCurrentUser(req: Request, res: Response) {
    const userId = req.user!.id;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(currentUser);
}

export async function refresh(req: Request, res: Response) {
    const currentRefreshToken = req.cookies[refreshTokenCookie.name];
    if (!currentRefreshToken) {
        return res.status(401).json({ error: 'Refresh token not provided' });
    }

    try {
        verifyRefreshToken(currentRefreshToken);

        const storedToken = await RefreshToken.findOneAndDelete({ token: currentRefreshToken });
        if (!storedToken) {
            clearCookie(res, refreshTokenCookie);
            return res.status(401).json({ error: 'Refresh token not found' });
        }

        const user = await User.findById(storedToken.userId);
        if (!user) {
            clearCookie(res, refreshTokenCookie);
            return res.status(401).json({ error: 'User not found' });
        }

        const { accessToken, refreshToken, refreshTokenExpiresAt } = await createTokenPair(user.id, user.role);

        setCookie(res, refreshTokenCookie, refreshToken, refreshTokenExpiresAt - Date.now());
        res.json({ accessToken });
    } catch (err) {
        clearCookie(res, refreshTokenCookie);

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Refresh token expired' });
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        throw err;
    }
}

export async function logout(req: Request, res: Response) {
    const refreshToken = req.cookies[refreshTokenCookie.name];
    if (refreshToken) {
        await RefreshToken.deleteOne({ token: refreshToken });
        clearCookie(res, refreshTokenCookie);
    }

    return res.status(204).end();
}
