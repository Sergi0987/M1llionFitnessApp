import { Router } from 'express';
import {
  addCheckin,
  addClientNote,
  assignProgram,
  createClient,
  deleteClient,
  getClientById,
  getClients,
  resetClientPassword,
  updateClient,
} from '../controllers/clientController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));
router.get('/', getClients);
router.post('/', createClient);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.put('/:id/password', resetClientPassword);
router.delete('/:id', deleteClient);
router.post('/:id/checkins', addCheckin);
router.post('/:id/notes', addClientNote);
router.post('/:id/programs', assignProgram);

export default router;
