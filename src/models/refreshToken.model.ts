import mongoose, { InferSchemaType } from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
});

export type IRefreshToken = InferSchemaType<typeof refreshTokenSchema>;

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
