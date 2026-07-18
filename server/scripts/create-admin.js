// Creates (or updates the password of) an admin account.
// Usage: node scripts/create-admin.js <email> <password>
import bcrypt from 'bcrypt';
import { pool } from '../src/config/db.js';

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: node scripts/create-admin.js <email> <password>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);

await pool.query(
  `INSERT INTO users (email, password, role)
   VALUES ($1, $2, 'admin')
   ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password
   WHERE users.role = 'admin'`,
  [email.trim().toLowerCase(), passwordHash],
);

console.log(`Admin account ready for ${email.trim().toLowerCase()}.`);
await pool.end();
