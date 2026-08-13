import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { authApi, saveSession } from '../services/api.js';

export default function Login({ theme, setTheme }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isDark = theme === 'dark';

  const logo = isDark ? '/logoWhite.png' : '/logoBlack.png';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      const session = await authApi.login(form);
      saveSession(session);
      navigate(session.user.role === 'admin' ? '/admin' : '/app');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
     <main
      className={`m1 min-h-screen px-4 sm:px-6 ${
        isDark
          ? 'bg-charcoal text-bone'
          : 'bg-bone text-charcoal'
      }`}
    >
      <header className="mx-auto flex max-w-6xl items-center justify-between py-5">
        <Link to="/">
          <img src={logo} alt="M1llion Fitness" className="h-10 w-auto md:h-12" />
        </Link>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>
      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center">
      <form onSubmit={handleSubmit} className={`w-full max-w-md border p-8 ${isDark ? 'border-bone/20 bg-graphite' : 'border-charcoal/20 bg-paper'}`}>
        <p className={`text-sm font-bold uppercase tracking-[0.2em] ${isDark ? 'text-sage' : 'text-olive'}`}>M1llion Fitness</p>
        <h1 className="mt-3 font-display text-3xl uppercase leading-[0.96]">Client Portal Login</h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-sand' : 'text-graphite'}`}>
          Coach and client access for programs, check-ins, and workout tracking.
        </p>
        <input
          className={`mt-8 w-full border px-4 py-3 outline-none focus:border-olive ${isDark ? 'border-bone/20 bg-charcoal text-bone focus:border-butter' : 'border-charcoal/20 bg-bone'}`}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className={`mt-4 w-full border px-4 py-3 outline-none focus:border-olive ${isDark ? 'border-bone/20 bg-charcoal text-bone focus:border-butter' : 'border-charcoal/20 bg-bone'}`}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {error ? (
          <p className={`mt-4 border p-3 text-sm ${isDark ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-red-600/25 bg-red-50 text-red-700'}`}>
            {error}
          </p>
        ) : null}
        <Button className="mt-6 w-full" type="submit" disabled={loading} isDark={isDark}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>
      </div>
    </main>
  );
}
