const styles = {
  Active: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  Paused: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
  Completed: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
  Beginner: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  Intermediate: 'border-gold-400/20 bg-gold-400/10 text-gold-300',
  Advanced: 'border-red-500/20 bg-red-500/10 text-red-200',
};

export default function Badge({ value }) {
  return (
    <span className={`inline-flex min-w-20 items-center justify-center rounded-md border px-2.5 py-1 text-center text-xs font-semibold ${styles[value] || styles.Active}`}>
      {value}
    </span>
  );
}
