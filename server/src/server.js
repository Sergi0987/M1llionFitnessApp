import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { query } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import portalRoutes from './routes/portalRoutes.js';
import programRoutes from './routes/programRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Render runs the app behind a proxy; needed so rate limiting sees real client IPs.
app.set('trust proxy', 1);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
      if (!origin || origin === allowedOrigin || /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  }),
);
// Larger limit so check-in progress photos (compressed client-side) fit in the body.
app.use(express.json({ limit: '4mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/admin/clients', clientRoutes);
app.use('/api/admin/programs', programRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/workouts', workoutRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

// Idempotent migrations so deploys don't require manual database changes.
try {
  await query('ALTER TABLE checkins ADD COLUMN IF NOT EXISTS photo TEXT');
} catch (error) {
  console.error('Startup migration failed:', error.message);
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
