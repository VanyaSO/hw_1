import { Router } from 'express';
import { register, login, getCurrentUser, refresh, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../validation/auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
