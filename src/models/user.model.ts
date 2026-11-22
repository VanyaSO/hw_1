import mongoose, { InferSchemaType } from 'mongoose';
import { toJSONTransform } from '../utils/toJSON';
import { Role } from '../types/auth';

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
            enum: Object.values(Role),
            default: Role.Customer,
        },
    },
    {
        timestamps: true,
        toJSON: { transform: toJSONTransform(['password']) },
    },
);

export type IUser = InferSchemaType<typeof userSchema>;

export const User = mongoose.model<IUser>('User', userSchema);
