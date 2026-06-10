# M1llion Fitness Platform

A merged full-stack platform for the M1llion Fitness brand:

- Public marketing website
- Admin/coach dashboard
- Client portal
- Program assignment
- Weekly check-ins
- Workout logging

## Folder Structure

```txt
M1llionFitnessPlatform/
  client/
    src/
      components/
      pages/
      services/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      routes/
    schema.sql
```

## Database Setup

```sql
CREATE DATABASE m1llion_fitness_platform;
```

From the project root:

```powershell
psql -U postgres -d m1llion_fitness_platform -f server/schema.sql
```

The schema creates a default admin:

```txt
email: admin@m1llionfitness.com
password: Admin123!
```

Change this password after first login in a production app.

## Backend Setup

```powershell
cd server
npm.cmd install
Copy-Item .env.example .env
```

Update `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
DATABASE_URL=postgres://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/m1llion_fitness_platform
```

Start the backend:

```powershell
npm.cmd run dev
```

## Frontend Setup

Open a second terminal:

```powershell
cd client
npm.cmd install
npm.cmd run dev
```

## App Routes

- `/` public M1llion Fitness site
- `/login` login
- `/admin` admin dashboard
- `/admin/clients` manage clients
- `/admin/programs` manage programs
- `/app` client portal
- `/app/workouts` client workout tracker
- `/app/checkins` client check-ins
