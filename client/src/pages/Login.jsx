import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { authApi, saveSession } from '../services/api.js';

export default function Login({ theme, setTheme }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const isDark = theme === 'dark';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const session = await authApi.login(form);
      saveSession(session);
      navigate(session.user.role === 'admin' ? '/admin' : '/app');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className={`min-h-screen px-6 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'}`}>
      <header className="mx-auto flex max-w-6xl items-center justify-between py-5">
        <Link to="/">
          <img src="/logoCropped.png" alt="M1llion Fitness" className="h-10 w-auto md:h-12" />
        </Link>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>
      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center">
      <form onSubmit={handleSubmit} className={`w-full max-w-md rounded-2xl border p-8 shadow-sm ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500">M1llion Fitness</p>
        <h1 className="mt-3 text-3xl font-black">Client Portal Login</h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Coach and client access for programs, check-ins, and workout tracking.
        </p>
        <input
          className={`mt-8 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${isDark ? 'border-white/10 bg-slate-950 text-white' : 'border-slate-300 bg-white'}`}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className={`mt-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${isDark ? 'border-white/10 bg-slate-950 text-white' : 'border-slate-300 bg-white'}`}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {error ? <p className="mt-4 rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
        <Button className="mt-6 w-full" type="submit">Login</Button>
      </form>
      </div>
    </main>
  );
}
