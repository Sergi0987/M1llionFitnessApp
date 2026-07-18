import { useState } from 'react';
import Button from '../components/Button.jsx';
import { authApi, getSession } from '../services/api.js';
import { getThemeClasses } from '../utils/themeClasses.js';

const emptyForm = {
  current_password: '',
  new_password: '',
  confirm_password: '',
};

export default function AccountSettings({ theme }) {
  const session = getSession();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const classes = getThemeClasses(theme);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (form.new_password !== form.confirm_password) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      setSaving(true);

      await authApi.changePassword({
        current_password: form.current_password,
        new_password: form.new_password,
      });

      setForm(emptyForm);
      setSuccess('Your password has been updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <p className={`text-xs font-bold uppercase tracking-[0.2em] sm:text-sm ${classes.eyebrow}`}>
        Account
      </p>

      <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">Account settings</h1>

      <p className={`mt-3 max-w-2xl text-sm sm:text-base ${classes.muted}`}>
        Signed in as <span className="font-semibold">{session?.user?.email}</span>
      </p>

      <form
        onSubmit={handleSubmit}
        className={`mt-6 max-w-md space-y-4 rounded-2xl border p-4 sm:mt-8 sm:p-6 ${classes.panel}`}
      >
        <h2 className="text-lg font-bold sm:text-xl">Change password</h2>

        <label className="block">
          <span className={`mb-2 block text-sm font-semibold ${classes.muted}`}>
            Current password
          </span>

          <input
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
            type="password"
            autoComplete="current-password"
            value={form.current_password}
            onChange={(event) => setForm({ ...form, current_password: event.target.value })}
            required
          />
        </label>

        <label className="block">
          <span className={`mb-2 block text-sm font-semibold ${classes.muted}`}>
            New password (at least 8 characters)
          </span>

          <input
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={form.new_password}
            onChange={(event) => setForm({ ...form, new_password: event.target.value })}
            required
          />
        </label>

        <label className="block">
          <span className={`mb-2 block text-sm font-semibold ${classes.muted}`}>
            Confirm new password
          </span>

          <input
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500 ${classes.input}`}
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={form.confirm_password}
            onChange={(event) => setForm({ ...form, confirm_password: event.target.value })}
            required
          />
        </label>

        {error ? (
          <p className={`rounded-md bg-red-500/10 p-3 text-sm ${classes.isDark ? 'text-red-300' : 'text-red-600'}`}>
            {error}
          </p>
        ) : null}

        {success ? (
          <p className={`rounded-md bg-emerald-500/10 p-3 text-sm ${classes.isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
            {success}
          </p>
        ) : null}

        <Button className="w-full sm:w-auto" type="submit" disabled={saving}>
          {saving ? 'Updating...' : 'Update password'}
        </Button>
      </form>
    </section>
  );
}
