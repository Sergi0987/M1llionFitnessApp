import { useEffect, useState } from 'react';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import { adminApi } from '../services/api.js';
import { getThemeClasses } from '../utils/themeClasses.js';

const emptyProgram = { title: '', description: '', difficulty: 'Beginner' };
const emptyWorkout = {
  title: '',
  day_label: '',
  exercises: [{ name: '', sets: 3, reps: '8-12', notes: '' }],
};

export default function AdminPrograms({ theme }) {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [form, setForm] = useState(emptyProgram);
  const [workoutForm, setWorkoutForm] = useState(emptyWorkout);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const classes = getThemeClasses(theme);

  async function load() {
    const rows = await adminApi.programs();
    setPrograms(rows);

    if (selectedProgram) {
      setSelectedProgram(await adminApi.program(selectedProgram.id));
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function saveProgram(event) {
    event.preventDefault();

    try {
      setError('');

      if (editingId) {
        await adminApi.updateProgram(editingId, form);
      } else {
        await adminApi.createProgram(form);
      }

      setEditingId(null);
      setForm(emptyProgram);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function openProgram(program) {
    const fullProgram = await adminApi.program(program.id);
    setSelectedProgram(fullProgram);
    setEditingId(fullProgram.id);
    setForm({
      title: fullProgram.title,
      description: fullProgram.description,
      difficulty: fullProgram.difficulty,
    });
  }

  function updateExercise(index, field, value) {
    setWorkoutForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise, exerciseIndex) =>
        exerciseIndex === index ? { ...exercise, [field]: value } : exercise,
      ),
    }));
  }

  async function addWorkout(event) {
    event.preventDefault();

    if (!selectedProgram) {
      setError('Select a program before adding workouts.');
      return;
    }

    await adminApi.addProgramWorkout(selectedProgram.id, workoutForm);
    setWorkoutForm(emptyWorkout);
    setSelectedProgram(await adminApi.program(selectedProgram.id));
  }

  async function deleteWorkout(workoutId) {
    await adminApi.deleteProgramWorkout(selectedProgram.id, workoutId);
    setSelectedProgram(await adminApi.program(selectedProgram.id));
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <p className={`text-sm font-bold uppercase tracking-[0.2em] ${classes.eyebrow}`}>Programs</p>
      <h1 className="mt-2 font-display text-3xl uppercase leading-[0.96]">Training library</h1>
      {error ? (
        <p className={`mt-6 border p-3 ${classes.isDark ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-red-600/25 bg-red-50 text-red-700'}`}>
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <form onSubmit={saveProgram} className={`space-y-4 border p-6 ${classes.panel}`}>
            <h2 className="text-xl font-bold">{editingId ? 'Edit program' : 'Create program'}</h2>
            <input
              className={`w-full border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
              placeholder="Program title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
            <textarea
              className={`min-h-28 w-full border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
              placeholder="Description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />
            <select
              className={`w-full border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
              value={form.difficulty}
              onChange={(event) => setForm({ ...form, difficulty: event.target.value })}
            >
              {['Beginner', 'Intermediate', 'Advanced'].map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
            </select>
            <div className="flex gap-3">
              <Button type="submit" isDark={classes.isDark}>{editingId ? 'Update Program' : 'Create Program'}</Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="secondary"
                  isDark={classes.isDark}
                  onClick={() => {
                    setEditingId(null);
                    setSelectedProgram(null);
                    setForm(emptyProgram);
                  }}
                >
                  New
                </Button>
              ) : null}
            </div>
          </form>

          <div className="grid gap-3">
            {programs.map((program) => (
              <button
                key={program.id}
                className={`border p-5 text-left transition ${classes.panel}`}
                onClick={() => openProgram(program)}
              >
                <div className="flex justify-between gap-3">
                  <h2 className="font-bold">{program.title}</h2>
                  <Badge value={program.difficulty} isDark={classes.isDark} />
                </div>
                <p className={`mt-3 text-sm ${classes.muted}`}>{program.description}</p>
                <p className={`mt-3 text-xs ${classes.muted}`}>{program.assigned_count} clients assigned</p>
              </button>
            ))}
          </div>
        </div>

        <div className={`border p-6 ${classes.panel}`}>
          <h2 className="text-xl font-bold">Program workouts</h2>
          {!selectedProgram ? (
            <p className={`mt-4 text-sm ${classes.muted}`}>Select a program to add workout templates.</p>
          ) : (
            <>
              <form onSubmit={addWorkout} className="mt-5 space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className={`border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
                    placeholder="Workout title"
                    value={workoutForm.title}
                    onChange={(event) => setWorkoutForm({ ...workoutForm, title: event.target.value })}
                    required
                  />
                  <input
                    className={`border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
                    placeholder="Day label, e.g. Day 1"
                    value={workoutForm.day_label}
                    onChange={(event) => setWorkoutForm({ ...workoutForm, day_label: event.target.value })}
                  />
                </div>
                {workoutForm.exercises.map((exercise, index) => (
                  <div key={index} className="grid gap-3 md:grid-cols-[1.3fr_0.6fr_0.8fr_1fr]">
                    <input className={`border px-3 py-2 ${classes.input}`} placeholder="Exercise" value={exercise.name} onChange={(event) => updateExercise(index, 'name', event.target.value)} />
                    <input className={`border px-3 py-2 ${classes.input}`} type="number" min="1" value={exercise.sets} onChange={(event) => updateExercise(index, 'sets', event.target.value)} />
                    <input className={`border px-3 py-2 ${classes.input}`} placeholder="Reps" value={exercise.reps} onChange={(event) => updateExercise(index, 'reps', event.target.value)} />
                    <input className={`border px-3 py-2 ${classes.input}`} placeholder="Notes" value={exercise.notes} onChange={(event) => updateExercise(index, 'notes', event.target.value)} />
                  </div>
                ))}
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    isDark={classes.isDark}
                    onClick={() => setWorkoutForm({ ...workoutForm, exercises: [...workoutForm.exercises, { name: '', sets: 3, reps: '8-12', notes: '' }] })}
                  >
                    Add Exercise
                  </Button>
                  <Button type="submit" isDark={classes.isDark}>Add Workout</Button>
                </div>
              </form>

              <div className="mt-8 space-y-4">
                {selectedProgram.workouts?.length ? selectedProgram.workouts.map((workout) => (
                  <article key={workout.id} className={`p-4 ${classes.subPanel}`}>
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-semibold">{workout.title}</p>
                        {workout.day_label ? <p className={`text-sm ${classes.muted}`}>{workout.day_label}</p> : null}
                      </div>
                      <Button variant="danger" isDark={classes.isDark} onClick={() => deleteWorkout(workout.id)}>Delete</Button>
                    </div>
                    <div className="mt-4 space-y-2">
                      {workout.exercises.map((exercise) => (
                        <p key={exercise.id} className={`p-3 text-sm ${classes.isDark ? 'bg-graphite text-sand' : 'bg-paper text-graphite'}`}>
                          {exercise.name}: {exercise.sets} sets x {exercise.reps}
                          {exercise.notes ? ` - ${exercise.notes}` : ''}
                        </p>
                      ))}
                    </div>
                  </article>
                )) : <p className={`text-sm ${classes.muted}`}>No workouts added to this program yet.</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
