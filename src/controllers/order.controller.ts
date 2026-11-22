import { Request, Response } from 'express';
import { CreateOrderDto, CreateOrderItemDto, OrderStatus, UpdateOrderStatusDto } from '../types/order';
import { Product } from '../models/product.model';
import { IOrderItem, Order } from '../models/order.model';
import mongoose from 'mongoose';
import { OutOfStockError } from '../errors/OutOfStockError';
import { Role } from '../types/auth';
import { PaginationQuery } from '../types/pagination';
import { paginate } from '../utils/pagination';

export async function getAllOrders(req: Request<{}, unknown, unknown, PaginationQuery>, res: Response) {
    const { id: userId, role } = req.user!;

    const filter = role === Role.Admin ? {} : { userId };

    const orders = await paginate({
        model: Order,
        query: req.query,
        filter,
    });

    return res.status(200).json(orders);
}

export async function createOrder(req: Request<{}, unknown, CreateOrderDto>, res: Response) {
    const mergedItems = new Map<string, number>();
    req.body.items.forEach((item: CreateOrderItemDto) => {
        mergedItems.set(item.productId, (mergedItems.get(item.productId) ?? 0) + item.quantity);
    });

    const products = await Product.find({ _id: { $in: [...mergedItems.keys()] } });

    const orderItems: IOrderItem[] = [];
    let total = 0;
    for (const [productId, quantity] of mergedItems) {
        const product = products.find((p) => p.id === productId);

        if (!product) {
            return res.status(400).json({ error: `Product ${productId} not found` });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: `Not enough stock for ${product.name}` });
        }

        orderItems.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
        });

        total += product.price * quantity;
    }

    const session = await mongoose.startSession();
    try {
        const order = await session.withTransaction(async () => {
            for (const item of orderItems) {
                const result = await Product.findOneAndUpdate(
                    {
                        _id: item.productId,
                        stock: { $gte: item.quantity },
                    },
                    { $inc: { stock: -item.quantity } },
                    { returnDocument: 'after', session },
                );

                if (!result) {
                    throw new OutOfStockError(item.name);
                }
            }

            return (
                await Order.create(
                    [
                        {
                            userId: req.user!.id,
                            items: orderItems,
                            total,
                        },
                    ],
                    { session },
                )
            )[0];
        });

        return res.status(201).json(order);
    } catch (err) {
        if (err instanceof OutOfStockError) {
            return res.status(400).json({ error: err.message });
        }
        throw err;
    } finally {
        await session.endSession();
    }
}

export async function getOrderById(req: Request<{ id: string }>, res: Response) {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    const { id: userId, role } = req.user!;
    if (userId !== order.userId.toString() && role !== Role.Admin) {
        return res.status(403).json({ error: 'You do not have access to this order' });
    }

    return res.status(200).json(order);
}

export async function updateOrderStatus(req: Request<{ id: string }, unknown, UpdateOrderStatusDto>, res: Response) {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    const { status } = req.body;
    if (order.status === OrderStatus.Cancelled) {
        return res.status(400).json({ error: 'Order is cancelled and cannot be updated' });
    } else if (status === order.status) {
        return res.status(400).json({ error: `Order is already ${status}` });
    }

    const session = await mongoose.startSession();
    try {
        const updatedOrder = await session.withTransaction(async () => {
            const result = await Order.findOneAndUpdate(
                { _id: order._id, status: order.status },
                { status },
                { returnDocument: 'after', session },
            );

            if (!result) return null;

            if (status === OrderStatus.Cancelled) {
                for (const item of order.items) {
                    await Product.updateOne(
                        {
                            _id: item.productId,
                        },
                        { $inc: { stock: item.quantity } },
                        { session },
                    );
                }
            }

            return result;
        });

        if (!updatedOrder) {
            return res.status(409).json({ error: 'Order status was changed by another request' });
        }

        return res.status(200).json(updatedOrder);
    } finally {
        await session.endSession();
    }
}
