import { Router } from 'express';
import { createWorkout, deleteWorkout, getWorkouts } from '../controllers/workoutController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getWorkouts);
router.post('/', createWorkout);
router.delete('/:id', deleteWorkout);

export default router;
