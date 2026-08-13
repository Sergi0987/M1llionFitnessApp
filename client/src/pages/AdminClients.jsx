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
      <h1 className="mt-2 font-display text-3xl uppercase leading-[0.96]">Create client accounts</h1>
      {error ? (
        <p className={`mt-6 border p-3 ${classes.isDark ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-red-600/25 bg-red-50 text-red-700'}`}>
          {error}
        </p>
      ) : null}
      <form onSubmit={createClient} className={`mt-8 grid gap-4 border p-6 md:grid-cols-2 ${classes.panel}`}>
        {['name', 'email', 'phone', 'password'].map((field) => (
          <input
            key={field}
            className={`border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
            placeholder={field}
            type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
            value={form[field]}
            onChange={(event) => setForm({ ...form, [field]: event.target.value })}
            required={field !== 'phone'}
          />
        ))}
        <select
          className={`border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
          value={form.status}
          onChange={(event) => setForm({ ...form, status: event.target.value })}
        >
          {['Active', 'Paused', 'Completed'].map((status) => <option key={status}>{status}</option>)}
        </select>
        <input
          className={`border px-4 py-3 outline-none focus:border-olive ${classes.input}`}
          type="date"
          value={form.start_date}
          onChange={(event) => setForm({ ...form, start_date: event.target.value })}
        />
        <textarea
          className={`min-h-24 border px-4 py-3 outline-none focus:border-olive md:col-span-2 ${classes.input}`}
          placeholder="goal"
          value={form.goal}
          onChange={(event) => setForm({ ...form, goal: event.target.value })}
          required
        />
        <Button type="submit" isDark={classes.isDark}>Create Client</Button>
      </form>
      <div className={`mt-8 overflow-hidden border ${classes.divider}`}>
        {clients.map((client) => (
          <Link key={client.id} to={`/admin/clients/${client.id}`} className={`grid gap-3 border-t p-4 transition md:grid-cols-[1.3fr_1fr_1fr_1fr] ${classes.divider} ${classes.isDark ? 'bg-graphite hover:bg-charcoal' : 'bg-paper hover:bg-bone'}`}>
            <div>
              <p className="font-semibold">{client.name}</p>
              <p className={`text-sm ${classes.muted}`}>{client.email}</p>
            </div>
            <Badge value={client.status} isDark={classes.isDark} />
            <p className={`text-sm ${classes.muted}`}>{formatDate(client.start_date)}</p>
            <p className={`text-sm ${classes.muted}`}>{client.workout_count} workouts</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
