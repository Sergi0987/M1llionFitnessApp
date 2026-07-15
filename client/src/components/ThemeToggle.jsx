export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
        isDark
          ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
          : 'border-slate-300 bg-white text-slate-950 hover:bg-slate-100'
      }`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
