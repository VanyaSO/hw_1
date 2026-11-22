import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK' });
});

app.use((_req: Request, res: Response) => {
    return res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

export default app;
