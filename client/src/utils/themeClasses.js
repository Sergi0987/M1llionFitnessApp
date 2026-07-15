export function getThemeClasses(theme) {
  const isDark = theme === 'dark';

  return {
    isDark,
    eyebrow: isDark ? 'text-pink-400' : 'text-pink-500',
    muted: isDark ? 'text-slate-400' : 'text-slate-600',
    panel: isDark
      ? 'border-slate-800 bg-slate-900'
      : 'border-slate-200 bg-white shadow-sm',
    subPanel: isDark ? 'bg-slate-950' : 'bg-slate-50',
    input: isDark
      ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500'
      : 'border-slate-300 bg-white text-slate-950 placeholder:text-slate-500',
    divider: isDark ? 'border-slate-800' : 'border-slate-200',
  };
}
