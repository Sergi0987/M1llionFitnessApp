import { Router } from 'express';
import { createPortalCheckin, getPortal } from '../controllers/portalController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, requireRole('client'));
router.get('/', getPortal);
router.post('/checkins', createPortalCheckin);

export default router;
