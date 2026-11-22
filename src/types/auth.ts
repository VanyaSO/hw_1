import type z from 'zod';
import type { loginSchema, registerSchema } from '../validation/auth.schema';

export enum Role {
    Customer = 'customer',
    Admin = 'admin',
}

export type AccessTokenPayload = {
    sub: string;
    role: Role;
};

export type AuthUser = {
    id: string;
    role: Role;
};

export type RegisterDto = z.infer<typeof registerSchema>;

export type LoginDto = z.infer<typeof loginSchema>;
