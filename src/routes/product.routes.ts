import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from '../controllers/product.controller';
import { adminOnly } from '../middleware/routeAccess';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../validation/product.schema';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', ...adminOnly, validate(createProductSchema), createProduct);
router.patch('/:id', ...adminOnly, validate(updateProductSchema), updateProduct);
router.delete('/:id', ...adminOnly, deleteProduct);

export default router;
