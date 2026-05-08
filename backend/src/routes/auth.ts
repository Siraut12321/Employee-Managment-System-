import { Router } from 'express';
import { login, getMe, createAdmin } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/register', protect, authorize('super_admin'), createAdmin);

export default router;
