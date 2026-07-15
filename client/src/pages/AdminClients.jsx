import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import { adminApi } from '../services/api.js';
import { formatDate } from '../utils/formatDate.js';
import { getThemeClasses } from '../utils/themeClasses.js';

const emptyClient = {
  name: '',
  email: '',
  phone: '',
  goal: '',
  status: 'Active',
  start_date: new Date().toISOString().slice(0, 10),
  password: 'Client123!',
};

export default function AdminClients({ theme }) {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(emptyClient);
  const [error, setError] = useState('');
  const classes = getThemeClasses(theme);

  async function load() {
    setClients(await adminApi.clients());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function createClient(event) {
    event.preventDefault();
    try {
      setError('');
      await adminApi.createClient(form);
      setForm(emptyClient);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <p className={`text-sm font-bold uppercase tracking-[0.2em] ${classes.eyebrow}`}>Clients</p>
      <h1 className="mt-2 text-3xl font-black">Create client accounts</h1>
      {error ? <p className="mt-6 rounded-md bg-red-500/10 p-3 text-red-200">{error}</p> : null}
      <form onSubmit={createClient} className={`mt-8 grid gap-4 rounded-2xl border p-6 md:grid-cols-2 ${classes.panel}`}>
        {['name', 'email', 'phone', 'password'].map((field) => (
          <input
            key={field}
            className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
            placeholder={field}
            type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
            value={form[field]}
            onChange={(event) => setForm({ ...form, [field]: event.target.value })}
            required={field !== 'phone'}
          />
        ))}
        <select
          className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
          value={form.status}
          onChange={(event) => setForm({ ...form, status: event.target.value })}
        >
          {['Active', 'Paused', 'Completed'].map((status) => <option key={status}>{status}</option>)}
        </select>
        <input
          className={`rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
          type="date"
          value={form.start_date}
          onChange={(event) => setForm({ ...form, start_date: event.target.value })}
        />
        <textarea
          className={`min-h-24 rounded-xl border px-4 py-3 outline-none focus:border-pink-500 md:col-span-2 ${classes.input}`}
          placeholder="goal"
          value={form.goal}
          onChange={(event) => setForm({ ...form, goal: event.target.value })}
          required
        />
        <Button type="submit">Create Client</Button>
      </form>
      <div className={`mt-8 overflow-hidden rounded-2xl border ${classes.divider}`}>
        {clients.map((client) => (
          <Link key={client.id} to={`/admin/clients/${client.id}`} className={`grid gap-3 border-t p-4 transition md:grid-cols-[1.3fr_1fr_1fr_1fr] ${classes.divider} ${classes.isDark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white hover:bg-slate-50'}`}>
            <div>
              <p className="font-semibold">{client.name}</p>
              <p className={`text-sm ${classes.muted}`}>{client.email}</p>
            </div>
            <Badge value={client.status} />
            <p className={`text-sm ${classes.muted}`}>{formatDate(client.start_date)}</p>
            <p className={`text-sm ${classes.muted}`}>{client.workout_count} workouts</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
