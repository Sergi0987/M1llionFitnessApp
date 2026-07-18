import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
}

export async function login(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const result = await query('SELECT id, email, password, role FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      token: createToken(user),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const currentPassword = req.body.current_password;
    const newPassword = req.body.new_password;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ message: 'New password must be different from your current password.' });
    }

    const result = await query('SELECT id, password FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await query('UPDATE users SET password = $1 WHERE id = $2', [passwordHash, user.id]);

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    let client = null;

    if (req.user.role === 'client') {
      const result = await query('SELECT id, name, email FROM clients WHERE user_id = $1', [req.user.id]);
      client = result.rows[0] || null;
    }

    res.json({
      user: req.user,
      client,
    });
  } catch (error) {
    next(error);
  }
}
