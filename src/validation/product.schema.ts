import z from 'zod';

export const createProductSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().nullish(),
    price: z.number().min(0),
    stock: z.number().int().min(0).optional(),
});

export const updateProductSchema = createProductSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});
