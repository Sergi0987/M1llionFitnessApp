// One look everywhere now — the public site, login, and the dashboards all
// share this control, so it no longer needs a variant prop.
export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`border px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] transition-colors ${
        isDark ? 'border-bone/30 text-bone hover:border-bone' : 'border-charcoal/25 text-charcoal hover:border-charcoal'
      }`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}
