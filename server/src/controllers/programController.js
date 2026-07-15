import { pool, query } from '../config/db.js';

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

function normalizeProgram(body) {
  return {
    title: body.title?.trim(),
    description: body.description?.trim(),
    difficulty: body.difficulty || 'Beginner',
  };
}

function validateProgram(program) {
  if (!program.title || !program.description) {
    return 'Title and description are required.';
  }

  if (!difficulties.includes(program.difficulty)) {
    return 'Difficulty must be Beginner, Intermediate, or Advanced.';
  }

  return null;
}

export async function getPrograms(req, res, next) {
  try {
    const result = await query(
      `SELECT p.*, COUNT(cp.id)::int AS assigned_count
       FROM programs p
       LEFT JOIN client_programs cp ON cp.program_id = p.id
       GROUP BY p.id
       ORDER BY p.created_at DESC, p.id DESC`,
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function getProgramById(req, res, next) {
  try {
    const programResult = await query('SELECT * FROM programs WHERE id = $1', [req.params.id]);

    if (programResult.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found.' });
    }

    const workoutsResult = await query(
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
      [req.params.id],
    );

    res.json({
      ...programResult.rows[0],
      workouts: workoutsResult.rows,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProgram(req, res, next) {
  try {
    const program = normalizeProgram(req.body);
    const validationError = validateProgram(program);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await query(
      'INSERT INTO programs (title, description, difficulty) VALUES ($1, $2, $3) RETURNING *',
      [program.title, program.description, program.difficulty],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function updateProgram(req, res, next) {
  try {
    const program = normalizeProgram(req.body);
    const validationError = validateProgram(program);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await query(
      'UPDATE programs SET title = $1, description = $2, difficulty = $3 WHERE id = $4 RETURNING *',
      [program.title, program.description, program.difficulty, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function upsertProgramWorkout(req, res, next) {
  const client = await pool.connect();

  try {
    const title = req.body.title?.trim();
    const dayLabel = req.body.day_label?.trim() || '';
    const exercises = Array.isArray(req.body.exercises) ? req.body.exercises : [];

    if (!title) {
      return res.status(400).json({ message: 'Workout title is required.' });
    }

    await client.query('BEGIN');

    const workoutResult = await client.query(
      `INSERT INTO program_workouts (program_id, title, day_label, sort_order)
       VALUES ($1, $2, $3, COALESCE((SELECT MAX(sort_order) + 1 FROM program_workouts WHERE program_id = $1), 0))
       RETURNING *`,
      [req.params.id, title, dayLabel],
    );

    for (const [index, exercise] of exercises.entries()) {
      if (!exercise.name?.trim()) {
        continue;
      }

      await client.query(
        `INSERT INTO program_exercises (program_workout_id, name, sets, reps, notes, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          workoutResult.rows[0].id,
          exercise.name.trim(),
          Number(exercise.sets) || 1,
          String(exercise.reps || '').trim() || '8-12',
          exercise.notes?.trim() || '',
          index,
        ],
      );
    }

    await client.query('COMMIT');
    res.status(201).json(workoutResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
}

export async function deleteProgramWorkout(req, res, next) {
  try {
    const result = await query(
      'DELETE FROM program_workouts WHERE id = $1 AND program_id = $2 RETURNING id',
      [req.params.workoutId, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program workout not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function deleteProgram(req, res, next) {
  try {
    const result = await query('DELETE FROM programs WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
