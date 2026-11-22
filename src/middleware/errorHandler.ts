import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../errors/HttpError';

export function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) return next(err);

    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({ error: 'Invalid id' });
    }

    if (err instanceof HttpError) {
        return res.status(err.status).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
}
