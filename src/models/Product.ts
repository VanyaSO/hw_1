import mongoose, { InferSchemaType } from 'mongoose';

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
        toJSON: {
            transform(_doc, ret: Record<string, any>) {
                const { _id, __v, ...rest } = ret;
                return {
                    id: _id,
                    ...rest,
                };
            },
        },
    },
);

type IProduct = InferSchemaType<typeof productSchema>;

export const Product = mongoose.model<IProduct>('Product', productSchema);
