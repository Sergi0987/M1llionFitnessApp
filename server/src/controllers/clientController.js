import bcrypt from 'bcrypt';
import { pool, query } from '../config/db.js';
import { validateCheckinPhoto } from './portalController.js';

const statuses = ['Active', 'Paused', 'Completed'];

function normalizeClient(body) {
  return {
    name: body.name?.trim(),
    email: body.email?.trim().toLowerCase(),
    phone: body.phone?.trim() || '',
    goal: body.goal?.trim(),
    status: body.status || 'Active',
    start_date: body.start_date,
    password: body.password,
  };
}

function validateClient(client, requirePassword = false) {
  if (!client.name || !client.email || !client.goal || !client.start_date) {
    return 'Name, email, goal, and start date are required.';
  }

  if (!statuses.includes(client.status)) {
    return 'Status must be Active, Paused, or Completed.';
  }

  if (requirePassword && (!client.password || client.password.length < 8)) {
    return 'Client password must be at least 8 characters.';
  }

  return null;
}

export async function getClients(req, res, next) {
  try {
    const result = await query(
      `SELECT
        c.id, c.user_id, c.name, c.email, c.phone, c.goal, c.status, c.start_date, c.created_at,
        COUNT(DISTINCT ch.id)::int AS checkin_count,
        COUNT(DISTINCT w.id)::int AS workout_count,
        COUNT(DISTINCT cp.id)::int AS program_count
       FROM clients c
       LEFT JOIN checkins ch ON ch.client_id = c.id
       LEFT JOIN workouts w ON w.client_id = c.id
       LEFT JOIN client_programs cp ON cp.client_id = c.id
       GROUP BY c.id
       ORDER BY c.created_at DESC, c.id DESC`,
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function createClient(req, res, next) {
  const client = await pool.connect();

  try {
    const payload = normalizeClient(req.body);
    const validationError = validateClient(payload, true);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await client.query('BEGIN');

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const userResult = await client.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [payload.email, passwordHash, 'client'],
    );

    const result = await client.query(
      `INSERT INTO clients (user_id, name, email, phone, goal, status, start_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, name, email, phone, goal, status, start_date, created_at`,
      [
        userResult.rows[0].id,
        payload.name,
        payload.email,
        payload.phone,
        payload.goal,
        payload.status,
        payload.start_date,
      ],
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '23505') {
      return res.status(409).json({ message: 'A user or client with that email already exists.' });
    }

    next(error);
  } finally {
    client.release();
  }
}

export async function getClientById(req, res, next) {
  try {
    const result = await query('SELECT * FROM clients WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found.' });
    }

    const [checkins, programs, workouts, notes] = await Promise.all([
      query('SELECT * FROM checkins WHERE client_id = $1 ORDER BY created_at DESC', [req.params.id]),
      query(
        `SELECT p.*, cp.assigned_at
         FROM client_programs cp
         JOIN programs p ON p.id = cp.program_id
         WHERE cp.client_id = $1
         ORDER BY cp.assigned_at DESC`,
        [req.params.id],
      ),
      query('SELECT * FROM workouts WHERE client_id = $1 ORDER BY date DESC, id DESC', [req.params.id]),
      query('SELECT * FROM client_notes WHERE client_id = $1 ORDER BY created_at DESC, id DESC', [req.params.id]),
    ]);

    res.json({
      ...result.rows[0],
      checkins: checkins.rows,
      programs: programs.rows,
      workouts: workouts.rows,
      notes: notes.rows,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateClient(req, res, next) {
  try {
    const payload = normalizeClient(req.body);
    const validationError = validateClient(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await query(
      `UPDATE clients
       SET name = $1, email = $2, phone = $3, goal = $4, status = $5, start_date = $6
       WHERE id = $7
       RETURNING *`,
      [payload.name, payload.email, payload.phone, payload.goal, payload.status, payload.start_date, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function deleteClient(req, res, next) {
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN');

    const clientResult = await dbClient.query(
      `SELECT id, user_id
       FROM clients
       WHERE id = $1
       FOR UPDATE`,
      [req.params.id],
    );

    if (clientResult.rows.length === 0) {
      await dbClient.query('ROLLBACK');
      return res.status(404).json({ message: 'Client not found.' });
    }

    const userId = clientResult.rows[0].user_id;

    await dbClient.query(
      'DELETE FROM clients WHERE id = $1',
      [req.params.id],
    );

    if (userId) {
      await dbClient.query(
        `DELETE FROM users
         WHERE id = $1
           AND role = 'client'`,
        [userId],
      );
    }

    await dbClient.query('COMMIT');

    res.status(204).send();
  } catch (error) {
    await dbClient.query('ROLLBACK');
    next(error);
  } finally {
    dbClient.release();
  }
}

export async function resetClientPassword(req, res, next) {
  try {
    const newPassword = req.body.password;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }

    const clientResult = await query('SELECT id, user_id FROM clients WHERE id = $1', [req.params.id]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found.' });
    }

    if (!clientResult.rows[0].user_id) {
      return res.status(400).json({ message: 'This client does not have a login account.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await query(`UPDATE users SET password = $1 WHERE id = $2 AND role = 'client'`, [
      passwordHash,
      clientResult.rows[0].user_id,
    ]);

    res.json({ message: 'Client password has been reset.' });
  } catch (error) {
    next(error);
  }
}

export async function addCheckin(req, res, next) {
  try {
    const weight = Number(req.body.weight);
    const notes = req.body.notes?.trim();
    const progressRating = Number(req.body.progress_rating);
    const photo = req.body.photo || null;

    if (!weight || weight <= 0 || !notes || progressRating < 1 || progressRating > 10) {
      return res.status(400).json({ message: 'Valid weight, notes, and rating from 1-10 are required.' });
    }

    const photoError = validateCheckinPhoto(photo);

    if (photoError) {
      return res.status(400).json({ message: photoError });
    }

    const result = await query(
      `INSERT INTO checkins (client_id, weight, notes, progress_rating, photo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.params.id, weight, notes, progressRating, photo],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function assignProgram(req, res, next) {
  try {
    if (!req.body.program_id) {
      return res.status(400).json({ message: 'Program is required.' });
    }

    const result = await query(
      `INSERT INTO client_programs (client_id, program_id)
       VALUES ($1, $2)
       ON CONFLICT (client_id, program_id) DO UPDATE SET assigned_at = NOW()
       RETURNING *`,
      [req.params.id, req.body.program_id],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function addClientNote(req, res, next) {
  try {
    const note = req.body.note?.trim();

    if (!note) {
      return res.status(400).json({ message: 'Note is required.' });
    }

    const result = await query(
      'INSERT INTO client_notes (client_id, note) VALUES ($1, $2) RETURNING *',
      [req.params.id, note],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}
