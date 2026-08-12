export default function ThemeToggle({ theme, setTheme, variant = 'default' }) {
  const isDark = theme === 'dark';

  const styles =
    variant === 'plate'
      ? `border px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] transition-colors ${
          isDark ? 'border-bone/30 hover:border-bone' : 'border-charcoal/25 hover:border-charcoal'
        }`
      : `rounded-xl border px-3 py-2 text-sm font-semibold transition ${
          isDark
            ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
            : 'border-slate-300 bg-white text-slate-950 hover:bg-slate-100'
        }`;

  return (
    <button
      type="button"
      className={styles}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {variant === 'plate' ? (isDark ? 'Light' : 'Dark') : isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
