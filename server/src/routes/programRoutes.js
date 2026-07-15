import { Router } from 'express';
import {
  createProgram,
  deleteProgram,
  deleteProgramWorkout,
  getProgramById,
  getPrograms,
  updateProgram,
  upsertProgramWorkout,
} from '../controllers/programController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));
router.get('/', getPrograms);
router.post('/', createProgram);
router.get('/:id', getProgramById);
router.put('/:id', updateProgram);
router.delete('/:id', deleteProgram);
router.post('/:id/workouts', upsertProgramWorkout);
router.delete('/:id/workouts/:workoutId', deleteProgramWorkout);

export default router;
