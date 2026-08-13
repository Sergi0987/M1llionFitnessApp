import { useEffect, useRef, useState } from 'react';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import WeightChart from '../components/WeightChart.jsx';
import { portalApi } from '../services/api.js';
import { formatDate } from '../utils/formatDate.js';
import { compressImage } from '../utils/image.js';
import { getThemeClasses } from '../utils/themeClasses.js';

export default function ClientPortal({ theme }) {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({
    weight: '',
    notes: '',
    progress_rating: 7,
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef(null);
  const classes = getThemeClasses(theme);

  async function load() {
    setData(await portalApi.home());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setPhoto(null);
      return;
    }

    try {
      setError('');
      setPhoto(await compressImage(file));
    } catch (err) {
      setError(err.message);
      setPhoto(null);
      event.target.value = '';
    }
  }

  async function addCheckin(event) {
    event.preventDefault();

    try {
      setError('');
      setSaving(true);

      await portalApi.addCheckin({ ...form, photo });

      setForm({
        weight: '',
        notes: '',
        progress_rating: 7,
      });
      setPhoto(null);

      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }

      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!data) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {error || 'Loading portal...'}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <p
        className={`text-xs font-bold uppercase tracking-[0.2em] sm:text-sm ${classes.eyebrow}`}
      >
        Client Portal
      </p>

      <h1 className="mt-2 font-display text-3xl uppercase leading-[0.96] sm:text-4xl">
        Welcome, {data.client.name}
      </h1>

      <p className={`mt-3 max-w-2xl text-sm sm:text-base ${classes.muted}`}>
        {data.client.goal}
      </p>

      {error ? (
        <p className={`mt-6 border p-3 text-sm ${classes.isDark ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-red-600/25 bg-red-50 text-red-700'}`}>
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
        <article
          className={`min-w-0 border p-3 sm:p-5 ${classes.panel}`}
        >
          <p className={`text-[11px] leading-tight sm:text-sm ${classes.muted}`}>
            Assigned Programs
          </p>
          <p className="mt-2 text-2xl font-black sm:text-3xl">
            {data.programs.length}
          </p>
        </article>

        <article
          className={`min-w-0 border p-3 sm:p-5 ${classes.panel}`}
        >
          <p className={`text-[11px] leading-tight sm:text-sm ${classes.muted}`}>
            Check-ins
          </p>
          <p className="mt-2 text-2xl font-black sm:text-3xl">
            {data.checkins.length}
          </p>
        </article>

        <article
          className={`min-w-0 border p-3 sm:p-5 ${classes.panel}`}
        >
          <p className={`text-[11px] leading-tight sm:text-sm ${classes.muted}`}>
            Workouts
          </p>
          <p className="mt-2 text-2xl font-black sm:text-3xl">
            {data.workouts.length}
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={addCheckin}
          className={`space-y-4 border p-4 sm:p-6 ${classes.panel}`}
        >
          <h2 className="text-lg font-bold sm:text-xl">Weekly check-in</h2>

          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${classes.muted}`}>
              Weight
            </span>

            <input
              className={`w-full border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
              placeholder="Enter weight"
              type="number"
              step="0.1"
              value={form.weight}
              onChange={(event) =>
                setForm({
                  ...form,
                  weight: event.target.value,
                })
              }
              required
            />
          </label>

          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${classes.muted}`}>
              This weeks' rating (1–10)
            </span>

            <input
              className={`w-full border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
              type="number"
              min="1"
              max="10"
              value={form.progress_rating}
              onChange={(event) =>
                setForm({
                  ...form,
                  progress_rating: event.target.value,
                })
              }
              required
            />
          </label>

          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${classes.muted}`}>
              Notes
            </span>

            <textarea
              className={`min-h-24 w-full border px-4 py-3 outline-none focus:border-olive sm:min-h-28 ${classes.input}`}
              placeholder="How did the week go?"
              value={form.notes}
              onChange={(event) =>
                setForm({
                  ...form,
                  notes: event.target.value,
                })
              }
              required
            />
          </label>

          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${classes.muted}`}>
              Progress photo (optional)
            </span>

            <input
              ref={photoInputRef}
              className={`w-full border px-4 py-2.5 text-sm file:mr-3 file:border-0 file:bg-olive file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-bone ${classes.input}`}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </label>

          {photo ? (
            <img
              src={photo}
              alt="Progress preview"
              className={`max-h-40 border object-cover ${classes.divider}`}
            />
          ) : null}

          <Button className="w-full sm:w-auto" type="submit" disabled={saving} isDark={classes.isDark}>
            {saving ? 'Submitting...' : 'Submit Check-in'}
          </Button>
        </form>

        <div className={`border p-4 sm:p-6 ${classes.panel}`}>
          <h2 className="text-lg font-bold sm:text-xl">Assigned programs</h2>

          <div className="mt-4 space-y-3">
            {data.programs.length ? (
              data.programs.map((program) => (
                <article
                  key={program.id}
                  className={`p-4 ${classes.subPanel}`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-base font-semibold sm:text-lg">
                      {program.title}
                    </p>

                    <div className="self-start">
                      <Badge value={program.difficulty} isDark={classes.isDark} />
                    </div>
                  </div>

                  <p className={`mt-2 text-sm leading-6 ${classes.muted}`}>
                    {program.description}
                  </p>

                  {program.workouts?.length ? (
                    <div className="mt-4 space-y-3">
                      {program.workouts.map((workout) => (
                        <div
                          key={workout.id}
                          className={`p-3 sm:p-4 ${
                            classes.isDark ? 'bg-graphite' : 'bg-bone'
                          }`}
                        >
                          <p className="text-sm font-semibold sm:text-base">
                            {workout.day_label
                              ? `${workout.day_label}: `
                              : ''}
                            {workout.title}
                          </p>

                          <div className="mt-2 space-y-2">
                            {workout.exercises.map((exercise) => (
                              <p
                                key={exercise.id}
                                className={`text-xs leading-5 sm:text-sm ${classes.muted}`}
                              >
                                <span className="font-medium">
                                  {exercise.name}:
                                </span>{' '}
                                {exercise.sets} sets × {exercise.reps}
                                {exercise.notes
                                  ? ` — ${exercise.notes}`
                                  : ''}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <p className={`text-sm ${classes.muted}`}>
                No programs assigned yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        className={`mt-6 border p-4 sm:mt-8 sm:p-6 ${classes.panel}`}
      >
        <h2 className="text-lg font-bold sm:text-xl">Weight trend</h2>

        <div className="mt-4">
          <WeightChart checkins={data.checkins} theme={theme} />
        </div>
      </div>

      <div
        className={`mt-6 border p-4 sm:mt-8 sm:p-6 ${classes.panel}`}
      >
        <h2 className="text-lg font-bold sm:text-xl">Recent check-ins</h2>

        <div className="mt-4 space-y-3">
          {data.checkins.length ? (
            data.checkins.slice(0, 5).map((checkin) => (
              <article
                key={checkin.id}
                className={`p-4 ${classes.subPanel}`}
              >
                <p
                  className={`text-sm font-semibold ${
                    classes.isDark ? 'text-butter' : 'text-olive'
                  }`}
                >
                  {Number(checkin.weight).toString()} lbs ·{' '}
                  {checkin.progress_rating}/10 ·{' '}
                  {formatDate(checkin.created_at)}
                </p>

                <p
                  className={`mt-2 text-sm leading-6 ${classes.muted}`}
                >
                  {checkin.notes}
                </p>

                {checkin.photo ? (
                  <img
                    src={checkin.photo}
                    alt={`Progress photo from ${formatDate(checkin.created_at)}`}
                    className={`mt-3 max-h-48 border object-cover ${classes.divider}`}
                    loading="lazy"
                  />
                ) : null}
              </article>
            ))
          ) : (
            <p className={`text-sm ${classes.muted}`}>
              No check-ins submitted yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}