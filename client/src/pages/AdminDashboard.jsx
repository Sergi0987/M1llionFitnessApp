import { useEffect, useState } from 'react';
import Badge from '../components/Badge.jsx';
import { adminApi } from '../services/api.js';

export default function AdminDashboard({ theme }) {
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    async function load() {
      try {
        const [clientRows, programRows] = await Promise.all([adminApi.clients(), adminApi.programs()]);
        setClients(clientRows);
        setPrograms(programRows);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  const active = clients.filter((client) => client.status === 'Active').length;
  const checkins = clients.reduce((sum, client) => sum + client.checkin_count, 0);
  const workouts = clients.reduce((sum, client) => sum + client.workout_count, 0);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500">Admin</p>
      <h1 className={`mt-2 text-4xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Business command center</h1>
      {error ? <p className="mt-6 rounded-md bg-red-500/10 p-3 text-red-200">{error}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ['Clients', clients.length],
          ['Active', active],
          ['Check-ins', checkins],
          ['Workouts', workouts],
        ].map(([label, value]) => (
          <article key={label} className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>{label}</p>
            <p className={`mt-2 text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h2 className="text-xl font-bold">Recent clients</h2>
          <div className="mt-4 space-y-3">
            {clients.slice(0, 5).map((client) => (
              <div key={client.id} className={`flex justify-between rounded-xl p-4 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div>
                  <p className="font-semibold">{client.name}</p>
                  <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>{client.email}</p>
                </div>
                <Badge value={client.status} />
              </div>
            ))}
          </div>
        </div>
        <div className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h2 className="text-xl font-bold">Programs</h2>
          <div className="mt-4 space-y-3">
            {programs.slice(0, 5).map((program) => (
              <div key={program.id} className={`rounded-xl p-4 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="flex justify-between gap-3">
                  <p className="font-semibold">{program.title}</p>
                  <Badge value={program.difficulty} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
