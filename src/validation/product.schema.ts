import z from 'zod';

export const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().nullable(),
    price: z.number().min(0),
    stock: z.number().int().min(0).default(0),
});
