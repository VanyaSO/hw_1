import type z from 'zod';
import type { createProductSchema, updateProductSchema } from '../validation/product.schema';

export type CreateProductDto = z.infer<typeof createProductSchema>;

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
