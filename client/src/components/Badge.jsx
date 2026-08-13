// Coaching status (Active/Paused/Completed) keeps a real semantic
// vocabulary — these are functional signals, not brand decoration, so a
// muted green/amber/blue reads correctly here. Program difficulty ties to
// the brand's own earth palette instead, since it's not a status a coach
// needs to triage at a glance.
const STATUS = {
  Active: {
    dark: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    light: 'border-emerald-600/30 bg-emerald-50 text-emerald-700',
  },
  Paused: {
    dark: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    light: 'border-amber-600/30 bg-amber-50 text-amber-700',
  },
  Completed: {
    dark: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    light: 'border-blue-600/30 bg-blue-50 text-blue-700',
  },
  Beginner: {
    dark: 'border-sage/40 bg-sage/10 text-sage',
    light: 'border-olive/30 bg-olive/10 text-olive',
  },
  Intermediate: {
    dark: 'border-bronze/40 bg-bronze/15 text-clay',
    light: 'border-bronze/35 bg-bronze/10 text-bronze',
  },
  Advanced: {
    dark: 'border-transparent bg-bone text-charcoal',
    light: 'border-transparent bg-charcoal text-bone',
  },
};

export default function Badge({ value, isDark = false }) {
  const tone = STATUS[value] || STATUS.Active;

  return (
    <span
      className={`inline-flex min-w-20 items-center justify-center border px-2.5 py-1 text-center text-[0.68rem] font-semibold uppercase tracking-[0.08em] ${
        isDark ? tone.dark : tone.light
      }`}
    >
      {value}
    </span>
  );
}
