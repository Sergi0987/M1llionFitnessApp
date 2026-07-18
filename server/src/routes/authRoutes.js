import { Router } from 'express';
import { changePassword, login, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/change-password', requireAuth, changePassword);
router.get('/me', requireAuth, me);

export default router;
