import mongoose, { InferSchemaType } from 'mongoose';
import { OrderStatus } from '../types/order';
import { toJSONTransform } from '../utils/toJSON';

const ObjectId = mongoose.Schema.Types.ObjectId;

const orderItemSchema = new mongoose.Schema(
    {
        productId: { type: ObjectId, ref: 'Product', required: true },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false },
);

export type IOrderItem = InferSchemaType<typeof orderItemSchema>;

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Pending,
        },
    },
    {
        timestamps: true,
        toJSON: { transform: toJSONTransform() },
    },
);

export type IOrder = InferSchemaType<typeof orderSchema>;

export const Order = mongoose.model<IOrder>('Order', orderSchema);
