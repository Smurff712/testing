import { Router } from 'express';
import authRoutes from './auth.routes';
import todoRoutes from './todo.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/users', userRoutes);

export default router;
