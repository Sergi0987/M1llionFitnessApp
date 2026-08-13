import { useEffect, useState } from 'react';
import Badge from '../components/Badge.jsx';
import { adminApi } from '../services/api.js';

export default function AdminDashboard({ theme }) {
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState('');
  const isDark = theme === 'dark';
  const eyebrow = isDark ? 'text-sage' : 'text-olive';
  const muted = isDark ? 'text-sand' : 'text-graphite';
  const panel = isDark ? 'border-bone/20 bg-graphite' : 'border-charcoal/20 bg-paper';
  const subPanel = isDark ? 'bg-charcoal' : 'bg-bone';

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
      <p className={`text-sm font-bold uppercase tracking-[0.2em] ${eyebrow}`}>Admin</p>
      <h1 className="mt-2 font-display text-4xl uppercase leading-[0.96]">Business command center</h1>
      {error ? (
        <p className={`mt-6 border p-3 ${isDark ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-red-600/25 bg-red-50 text-red-700'}`}>
          {error}
        </p>
      ) : null}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ['Clients', clients.length],
          ['Active', active],
          ['Check-ins', checkins],
          ['Workouts', workouts],
        ].map(([label, value]) => (
          <article key={label} className={`border p-5 ${panel}`}>
            <p className={`text-sm ${muted}`}>{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className={`border p-6 ${panel}`}>
          <h2 className="text-xl font-bold">Recent clients</h2>
          <div className="mt-4 space-y-3">
            {clients.slice(0, 5).map((client) => (
              <div key={client.id} className={`flex justify-between p-4 ${subPanel}`}>
                <div>
                  <p className="font-semibold">{client.name}</p>
                  <p className={`text-sm ${muted}`}>{client.email}</p>
                </div>
                <Badge value={client.status} isDark={isDark} />
              </div>
            ))}
          </div>
        </div>
        <div className={`border p-6 ${panel}`}>
          <h2 className="text-xl font-bold">Programs</h2>
          <div className="mt-4 space-y-3">
            {programs.slice(0, 5).map((program) => (
              <div key={program.id} className={`p-4 ${subPanel}`}>
                <div className="flex justify-between gap-3">
                  <p className="font-semibold">{program.title}</p>
                  <Badge value={program.difficulty} isDark={isDark} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
