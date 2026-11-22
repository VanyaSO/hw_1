import z from 'zod';

const emailField = z.string().trim().toLowerCase().min(1).pipe(z.email());

export const registerSchema = z.object({
    email: emailField,
    password: z.string().min(8),
});

export const loginSchema = z.object({
    email: emailField,
    password: z.string().min(1),
});
