import z from 'zod';
import mongoose from 'mongoose';
import { OrderStatus } from '../types/order';

export const createOrderItemSchema = z.object({
    productId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid product id',
    }),
    quantity: z.number().int().min(1),
});

export const createOrderSchema = z.object({
    items: z.array(createOrderItemSchema).min(1),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(OrderStatus),
});
