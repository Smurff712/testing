import { Router } from 'express';
import { userController } from '../controllers';
import { authenticate } from '../middleware';
import { validate } from '../validators';
import { updateProfileSchema } from '../validators/user';

const router = Router();

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

export default router;
