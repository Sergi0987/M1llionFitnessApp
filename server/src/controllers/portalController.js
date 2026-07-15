import { query } from '../config/db.js';

async function getClientForUser(userId) {
  const result = await query('SELECT * FROM clients WHERE user_id = $1', [userId]);
  return result.rows[0];
}

export async function getPortal(req, res, next) {
  try {
    const client = await getClientForUser(req.user.id);

    if (!client) {
      return res.status(404).json({ message: 'Client profile not found.' });
    }

    const [checkins, programs, workouts] = await Promise.all([
      query('SELECT * FROM checkins WHERE client_id = $1 ORDER BY created_at DESC', [client.id]),
      query(
        `SELECT
          p.*,
          cp.assigned_at,
          COUNT(DISTINCT pw.id)::int AS workout_count
         FROM client_programs cp
         JOIN programs p ON p.id = cp.program_id
         LEFT JOIN program_workouts pw ON pw.program_id = p.id
         WHERE cp.client_id = $1
         GROUP BY p.id, cp.assigned_at
         ORDER BY cp.assigned_at DESC`,
        [client.id],
      ),
      query('SELECT * FROM workouts WHERE client_id = $1 ORDER BY date DESC, id DESC', [client.id]),
    ]);

    for (const program of programs.rows) {
      const programWorkouts = await query(
        `SELECT
          w.*,
          COALESCE(json_agg(json_build_object(
            'id', e.id,
            'name', e.name,
            'sets', e.sets,
            'reps', e.reps,
            'notes', e.notes,
            'sort_order', e.sort_order
          ) ORDER BY e.sort_order, e.id) FILTER (WHERE e.id IS NOT NULL), '[]') AS exercises
         FROM program_workouts w
         LEFT JOIN program_exercises e ON e.program_workout_id = w.id
         WHERE w.program_id = $1
         GROUP BY w.id
         ORDER BY w.sort_order, w.id`,
        [program.id],
      );

      program.workouts = programWorkouts.rows;
    }

    res.json({
      client,
      checkins: checkins.rows,
      programs: programs.rows,
      workouts: workouts.rows,
    });
  } catch (error) {
    next(error);
  }
}

export async function createPortalCheckin(req, res, next) {
  try {
    const client = await getClientForUser(req.user.id);
    const weight = Number(req.body.weight);
    const notes = req.body.notes?.trim();
    const progressRating = Number(req.body.progress_rating);

    if (!client) {
      return res.status(404).json({ message: 'Client profile not found.' });
    }

    if (!weight || weight <= 0 || !notes || progressRating < 1 || progressRating > 10) {
      return res.status(400).json({ message: 'Valid weight, notes, and rating from 1-10 are required.' });
    }

    const result = await query(
      'INSERT INTO checkins (client_id, weight, notes, progress_rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [client.id, weight, notes, progressRating],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}
