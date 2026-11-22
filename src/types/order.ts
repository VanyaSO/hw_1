import type z from 'zod';
import type { createOrderItemSchema, createOrderSchema, updateOrderStatusSchema } from '../validation/order.schema';

export enum OrderStatus {
    Pending = 'pending',
    Paid = 'paid',
    Shipped = 'shipped',
    Delivered = 'delivered',
    Cancelled = 'cancelled',
}

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export type CreateOrderItemDto = z.infer<typeof createOrderItemSchema>;

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
