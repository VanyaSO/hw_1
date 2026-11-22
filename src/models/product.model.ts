import mongoose, { InferSchemaType } from 'mongoose';
import { toJSONTransform } from '../utils/toJSON';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            min: 0,
            required: true,
        },
        stock: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { transform: toJSONTransform() },
    },
);

export type IProduct = InferSchemaType<typeof productSchema>;

export const Product = mongoose.model<IProduct>('Product', productSchema);
