import { authMiddleware } from './authMiddleware';
import { roleMiddleware } from './roleMiddleware';
import { Role } from '../types/auth';

export const adminOnly = [authMiddleware, roleMiddleware(Role.Admin)];
