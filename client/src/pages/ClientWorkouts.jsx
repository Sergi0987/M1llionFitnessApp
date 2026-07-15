import { useEffect, useState } from 'react';
import Button from '../components/Button.jsx';
import { portalApi } from '../services/api.js';
import { formatDate } from '../utils/formatDate.js';
import { getThemeClasses } from '../utils/themeClasses.js';

const emptyExercise = { name: '', sets: 3, reps: 10, weight: 0 };

export default function ClientWorkouts({ theme }) {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    date: new Date().toISOString().slice(0, 10),
    exercises: [{ ...emptyExercise }],
  });
  const [error, setError] = useState('');
  const classes = getThemeClasses(theme);

  async function load() {
    setWorkouts(await portalApi.workouts());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  function updateExercise(index, field, value) {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise, exerciseIndex) =>
        exerciseIndex === index ? { ...exercise, [field]: value } : exercise,
      ),
    }));
  }

  async function createWorkout(event) {
    event.preventDefault();
    try {
      setError('');
      await portalApi.createWorkout(form);
      setForm({ name: '', date: new Date().toISOString().slice(0, 10), exercises: [{ ...emptyExercise }] });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <p className={`text-sm font-bold uppercase tracking-[0.2em] ${classes.eyebrow}`}>Workout Tracker</p>
      <h1 className="mt-2 text-3xl font-black">Log your training</h1>
      {error ? <p className="mt-6 rounded-md bg-red-500/10 p-3 text-red-200">{error}</p> : null}
      <form onSubmit={createWorkout} className={`mt-8 space-y-4 rounded-2xl border p-6 ${classes.panel}`}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`} placeholder="Workout name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`} type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
        </div>
        {form.exercises.map((exercise, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-4">
            <input className={`rounded-xl border px-3 py-2 outline-none focus:border-pink-500 ${classes.input}`} placeholder="Exercise" value={exercise.name} onChange={(event) => updateExercise(index, 'name', event.target.value)} required />
            <input className={`rounded-xl border px-3 py-2 outline-none focus:border-pink-500 ${classes.input}`} type="number" min="1" value={exercise.sets} onChange={(event) => updateExercise(index, 'sets', event.target.value)} required />
            <input className={`rounded-xl border px-3 py-2 outline-none focus:border-pink-500 ${classes.input}`} type="number" min="1" value={exercise.reps} onChange={(event) => updateExercise(index, 'reps', event.target.value)} required />
            <input className={`rounded-xl border px-3 py-2 outline-none focus:border-pink-500 ${classes.input}`} type="number" min="0" value={exercise.weight} onChange={(event) => updateExercise(index, 'weight', event.target.value)} required />
          </div>
        ))}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => setForm({ ...form, exercises: [...form.exercises, { ...emptyExercise }] })}>
            Add Exercise
          </Button>
          <Button type="submit">Save Workout</Button>
        </div>
      </form>
      <div className="mt-8 space-y-4">
        {workouts.map((workout) => (
          <article key={workout.id} className={`rounded-2xl border p-5 ${classes.panel}`}>
            <div className="flex justify-between gap-3">
              <h2 className="font-bold">{workout.name}</h2>
              <p className={`text-sm ${classes.muted}`}>{formatDate(workout.date)}</p>
            </div>
            <div className="mt-4 grid gap-2">
              {workout.exercises.map((exercise) => (
                <p key={exercise.id} className={`rounded-xl p-3 text-sm ${classes.subPanel} ${classes.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {exercise.name}: {exercise.sets} sets x {exercise.reps} reps @ {Number(exercise.weight).toString()} lbs
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
