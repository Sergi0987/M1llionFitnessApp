import { useEffect, useState } from 'react';
import Badge from '../components/Badge.jsx';
// import BodyProgressVisual from '../components/BodyProgressVisual.jsx';
import Button from '../components/Button.jsx';
import { portalApi } from '../services/api.js';
import { formatDate } from '../utils/formatDate.js';
import { getThemeClasses } from '../utils/themeClasses.js';


export default function ClientPortal({ theme }) {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ weight: '', notes: '', progress_rating: 7 });
  const [error, setError] = useState('');
  const classes = getThemeClasses(theme);

  async function load() {
    setData(await portalApi.home());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function addCheckin(event) {
    event.preventDefault();
    try {
      setError('');
      await portalApi.addCheckin(form);
      setForm({ weight: '', notes: '', progress_rating: 7 });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!data) {
    return <section className="mx-auto max-w-7xl px-6 py-10">{error || 'Loading portal...'}</section>;
  }

  const latestCheckin = data.checkins[0];

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <p className={`text-sm font-bold uppercase tracking-[0.2em] ${classes.eyebrow}`}>Client Portal</p>
      <h1 className="mt-2 text-4xl font-black">Welcome, {data.client.name}</h1>
      <p className={`mt-3 max-w-2xl ${classes.muted}`}>{data.client.goal}</p>
      {error ? <p className="mt-6 rounded-md bg-red-500/10 p-3 text-red-200">{error}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className={`rounded-2xl border p-5 ${classes.panel}`}>
          <p className={`text-sm ${classes.muted}`}>Assigned Programs</p>
          <p className="mt-2 text-3xl font-black">{data.programs.length}</p>
        </article>
        <article className={`rounded-2xl border p-5 ${classes.panel}`}>
          <p className={`text-sm ${classes.muted}`}>Check-ins</p>
          <p className="mt-2 text-3xl font-black">{data.checkins.length}</p>
        </article>
        <article className={`rounded-2xl border p-5 ${classes.panel}`}>
          <p className={`text-sm ${classes.muted}`}>Workouts</p>
          <p className="mt-2 text-3xl font-black">{data.workouts.length}</p>
        </article>
      </div>
      {/* 
      <div className="mt-8">
        <BodyProgressVisual
          rating={latestCheckin?.progress_rating || 1}
          theme={theme}
        /> 
      </div> 
      */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={addCheckin} className={`space-y-4 rounded-2xl border p-6 ${classes.panel}`}>
          <h2 className="text-xl font-bold">Weekly check-in</h2>
          <input className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`} placeholder="Weight" type="number" value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} required />
          <input className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`} placeholder="Progress rating 1-10" type="number" min="1" max="10" value={form.progress_rating} onChange={(event) => setForm({ ...form, progress_rating: event.target.value })} required />
          <textarea className={`min-h-28 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`} placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} required />
          <Button type="submit">Submit Check-in</Button>
        </form>
        <div className={`rounded-2xl border p-6 ${classes.panel}`}>
          <h2 className="text-xl font-bold">Assigned programs</h2>
          <div className="mt-4 space-y-3">
            {data.programs.map((program) => (
              <article key={program.id} className={`rounded-xl p-4 ${classes.subPanel}`}>
                <div className="flex justify-between">
                  <p className="font-semibold">{program.title}</p>
                  <Badge value={program.difficulty} />
                </div>
                <p className={`mt-2 text-sm ${classes.muted}`}>{program.description}</p>
                {program.workouts?.length ? (
                  <div className="mt-4 space-y-3">
                    {program.workouts.map((workout) => (
                      <div key={workout.id} className={`rounded-lg p-3 ${classes.isDark ? 'bg-slate-900' : 'bg-white'}`}>
                        <p className="text-sm font-semibold">{workout.day_label ? `${workout.day_label}: ` : ''}{workout.title}</p>
                        <div className="mt-2 space-y-1">
                          {workout.exercises.map((exercise) => (
                            <p key={exercise.id} className={`text-xs ${classes.muted}`}>
                              {exercise.name}: {exercise.sets} sets x {exercise.reps}
                              {exercise.notes ? ` - ${exercise.notes}` : ''}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className={`mt-8 rounded-2xl border p-6 ${classes.panel}`}>
        <h2 className="text-xl font-bold">Recent check-ins</h2>
        <div className="mt-4 space-y-3">
          {data.checkins.slice(0, 5).map((checkin) => (
            <article key={checkin.id} className={`rounded-xl p-4 ${classes.subPanel}`}>
              <p className="text-sm text-gold-300">{Number(checkin.weight).toString()} lbs · {checkin.progress_rating}/10 · {formatDate(checkin.created_at)}</p>
              <p className={`mt-2 text-sm ${classes.isDark ? 'text-slate-300' : 'text-slate-700'}`}>{checkin.notes}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
