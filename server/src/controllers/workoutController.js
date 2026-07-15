import { pool, query } from '../config/db.js';

async function getClientId(req) {
  if (req.user.role === 'admin' && req.query.client_id) {
    return Number(req.query.client_id);
  }

  const result = await query('SELECT id FROM clients WHERE user_id = $1', [req.user.id]);
  return result.rows[0]?.id;
}

function normalizeExercises(exercises = []) {
  return exercises
    .filter((exercise) => exercise.name?.trim())
    .map((exercise) => ({
      name: exercise.name.trim(),
      sets: Number(exercise.sets),
      reps: Number(exercise.reps),
      weight: Number(exercise.weight || 0),
    }));
}

export async function getWorkouts(req, res, next) {
  try {
    const clientId = await getClientId(req);

    if (!clientId) {
      return res.status(404).json({ message: 'Client profile not found.' });
    }

    const result = await query(
      `SELECT
        w.*,
        COALESCE(json_agg(json_build_object(
          'id', e.id,
          'name', e.name,
          'sets', e.sets,
          'reps', e.reps,
          'weight', e.weight
        )) FILTER (WHERE e.id IS NOT NULL), '[]') AS exercises
       FROM workouts w
       LEFT JOIN exercises e ON e.workout_id = w.id
       WHERE w.client_id = $1
       GROUP BY w.id
       ORDER BY w.date DESC, w.id DESC`,
      [clientId],
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function createWorkout(req, res, next) {
  const client = await pool.connect();

  try {
    const clientId = await getClientId(req);
    const name = req.body.name?.trim();
    const date = req.body.date;
    const exercises = normalizeExercises(req.body.exercises);

    if (!clientId || !name || !date) {
      return res.status(400).json({ message: 'Workout name and date are required.' });
    }

    await client.query('BEGIN');

    const workoutResult = await client.query(
      'INSERT INTO workouts (client_id, name, date) VALUES ($1, $2, $3) RETURNING *',
      [clientId, name, date],
    );

    for (const exercise of exercises) {
      await client.query(
        'INSERT INTO exercises (workout_id, name, sets, reps, weight) VALUES ($1, $2, $3, $4, $5)',
        [workoutResult.rows[0].id, exercise.name, exercise.sets, exercise.reps, exercise.weight],
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ ...workoutResult.rows[0], exercises });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
}

export async function deleteWorkout(req, res, next) {
  try {
    const clientId = await getClientId(req);
    const result = await query('DELETE FROM workouts WHERE id = $1 AND client_id = $2 RETURNING id', [
      req.params.id,
      clientId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Workout not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
