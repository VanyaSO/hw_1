import mongoose, { InferSchemaType } from 'mongoose';

export enum Roles {
    Customer = 'customer',
    Admin = 'admin',
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(Roles),
            default: Roles.Customer,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret: Record<string, any>) {
                const { _id, __v, password, ...rest } = ret;
                return {
                    id: _id,
                    ...rest,
                };
            },
        },
    },
);

type IUser = InferSchemaType<typeof userSchema>;

export const User = mongoose.model<IUser>('User', userSchema);
