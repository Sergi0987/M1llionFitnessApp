import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import WeightChart from '../components/WeightChart.jsx';
import { adminApi } from '../services/api.js';
import { formatDate } from '../utils/formatDate.js';
import { getThemeClasses } from '../utils/themeClasses.js';

export default function AdminClientDetails({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const classes = getThemeClasses(theme);

  const [client, setClient] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [status, setStatus] = useState('Active');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [note, setNote] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function load() {
    const [clientRow, programRows] = await Promise.all([
      adminApi.client(id),
      adminApi.programs(),
    ]);

    setClient(clientRow);
    setStatus(clientRow.status);
    setPrograms(programRows);
    setSelectedProgram(programRows[0]?.id || '');
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, [id]);

  async function saveStatus(event) {
    event.preventDefault();

    try {
      setError('');

      await adminApi.updateClient(id, {
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        goal: client.goal,
        start_date: client.start_date.slice(0, 10),
        status,
      });

      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function assignProgram(event) {
    event.preventDefault();

    if (!selectedProgram) {
      return;
    }

    try {
      setError('');
      await adminApi.assignProgram(id, selectedProgram);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addNote(event) {
    event.preventDefault();

    if (!note.trim()) {
      return;
    }

    try {
      setError('');
      await adminApi.addClientNote(id, note);
      setNote('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();

    try {
      setError('');
      setResetMessage('');

      const result = await adminApi.resetClientPassword(id, newPassword);

      setNewPassword('');
      setResetMessage(result.message);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteClient() {
    try {
      setIsDeleting(true);
      setError('');

      await adminApi.deleteClient(id);
      navigate('/admin/clients', { replace: true });
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }

  if (!client) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        {error || 'Loading client...'}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <Link
        className={`text-sm font-semibold ${classes.eyebrow}`}
        to="/admin/clients"
      >
        Back to clients
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge value={client.status} />

          <h1 className="mt-4 text-4xl font-black">{client.name}</h1>

          <p className={`mt-2 ${classes.muted}`}>
            {client.email} · {client.phone || 'No phone'}
          </p>

          <p className="mt-4 max-w-3xl">{client.goal}</p>

          <p className={`mt-3 text-sm ${classes.muted}`}>
            Started {formatDate(client.start_date)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="rounded-xl border border-red-500 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          Delete Client
        </button>
      </div>

      {error ? (
        <p className="mt-6 rounded-md bg-red-500/10 p-3 text-red-300">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={saveStatus}
          className={`rounded-2xl border p-6 ${classes.panel}`}
        >
          <h2 className="text-xl font-bold">Edit status</h2>

          <select
            className={`mt-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {['Active', 'Paused', 'Completed'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <Button className="mt-4" type="submit">
            Save Status
          </Button>
        </form>

        <form
          onSubmit={assignProgram}
          className={`rounded-2xl border p-6 ${classes.panel}`}
        >
          <h2 className="text-xl font-bold">Assign program</h2>

          <select
            className={`mt-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
            value={selectedProgram}
            onChange={(event) => setSelectedProgram(event.target.value)}
          >
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </select>

          <Button
            className="mt-4"
            type="submit"
            disabled={!programs.length}
          >
            Assign Program
          </Button>
        </form>

        <form
          onSubmit={addNote}
          className={`rounded-2xl border p-6 ${classes.panel}`}
        >
          <h2 className="text-xl font-bold">Add profile note</h2>

          <textarea
            className={`mt-4 min-h-24 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add coaching context, preferences, injuries, or reminders."
          />

          <Button className="mt-4" type="submit">
            Add Note
          </Button>
        </form>

        <form
          onSubmit={resetPassword}
          className={`rounded-2xl border p-6 ${classes.panel}`}
        >
          <h2 className="text-xl font-bold">Reset login password</h2>

          <p className={`mt-2 text-sm ${classes.muted}`}>
            Set a new portal password for this client. Share it with them
            securely — they can change it themselves from their Account page.
          </p>

          <input
            className={`mt-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
            type="text"
            minLength={8}
            placeholder="New password (at least 8 characters)"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />

          {resetMessage ? (
            <p
              className={`mt-3 rounded-md bg-emerald-500/10 p-3 text-sm ${
                classes.isDark ? 'text-emerald-300' : 'text-emerald-600'
              }`}
            >
              {resetMessage}
            </p>
          ) : null}

          <Button className="mt-4" type="submit">
            Reset Password
          </Button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className={`rounded-2xl border p-6 ${classes.panel}`}>
          <h2 className="text-xl font-bold">Programs</h2>

          <div className="mt-4 space-y-3">
            {client.programs?.length ? (
              client.programs.map((program) => (
                <article
                  key={program.id}
                  className={`rounded-xl p-4 ${classes.subPanel}`}
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold">{program.title}</p>
                    <Badge value={program.difficulty} />
                  </div>
                </article>
              ))
            ) : (
              <p className={`text-sm ${classes.muted}`}>
                No programs assigned.
              </p>
            )}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${classes.panel}`}>
          <h2 className="text-xl font-bold">Profile notes</h2>

          <div className="mt-4 space-y-3">
            {client.notes?.length ? (
              client.notes.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-xl p-4 ${classes.subPanel}`}
                >
                  <p className="text-sm">{item.note}</p>

                  <p className={`mt-2 text-xs ${classes.muted}`}>
                    {formatDate(item.created_at)}
                  </p>
                </article>
              ))
            ) : (
              <p className={`text-sm ${classes.muted}`}>
                No profile notes yet.
              </p>
            )}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${classes.panel}`}>
          <h2 className="text-xl font-bold">Activity</h2>

          <p className={`mt-4 text-sm ${classes.muted}`}>
            {client.checkins?.length || 0} check-ins
          </p>

          <p className={`mt-2 text-sm ${classes.muted}`}>
            {client.workouts?.length || 0} workouts
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className={`rounded-2xl border p-6 ${classes.panel}`}>
          <h2 className="text-xl font-bold">Weight trend</h2>

          <div className="mt-4">
            <WeightChart checkins={client.checkins} theme={theme} />
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${classes.panel}`}>
          <h2 className="text-xl font-bold">Recent check-ins</h2>

          <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
            {client.checkins?.length ? (
              client.checkins.map((checkin) => (
                <article
                  key={checkin.id}
                  className={`rounded-xl p-4 ${classes.subPanel}`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      classes.isDark ? 'text-pink-300' : 'text-pink-600'
                    }`}
                  >
                    {Number(checkin.weight).toString()} lbs ·{' '}
                    {checkin.progress_rating}/10 ·{' '}
                    {formatDate(checkin.created_at)}
                  </p>

                  <p className={`mt-2 text-sm leading-6 ${classes.muted}`}>
                    {checkin.notes}
                  </p>

                  {checkin.photo ? (
                    <img
                      src={checkin.photo}
                      alt={`Progress photo from ${formatDate(checkin.created_at)}`}
                      className="mt-3 max-h-48 rounded-lg object-cover"
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
      </div>

      {showDeleteModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-client-title"
        >
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${classes.panel}`}
          >
            <h2 id="delete-client-title" className="text-2xl font-bold">
              Delete client?
            </h2>

            <p className={`mt-3 text-sm ${classes.muted}`}>
              This will permanently delete{' '}
              <span className="font-semibold">{client.name}</span>, their login
              account, check-ins, workouts, notes, and assigned programs.
            </p>

            <p className="mt-3 text-sm font-semibold text-red-400">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteClient}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Client'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}