import { Router } from 'express';
import { authController } from '../controllers';
import { authenticate } from '../middleware';
import { validate } from '../validators';
import { registerSchema, loginSchema } from '../validators/auth';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
