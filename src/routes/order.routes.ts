import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/routeAccess';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from '../controllers/order.controller';
import { validate } from '../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../validation/order.schema';

const router = Router();

router.get('/', authMiddleware, getAllOrders);
router.post('/', authMiddleware, validate(createOrderSchema), createOrder);
router.get('/:id', authMiddleware, getOrderById);

router.patch('/:id/status', ...adminOnly, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
