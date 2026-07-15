export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-pink-500 text-white hover:bg-pink-400',
    secondary: 'border border-slate-700 bg-slate-950 text-slate-100 hover:border-pink-500',
    danger: 'border border-red-500/50 bg-red-500/10 text-red-200 hover:bg-red-500/20',
  };

  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
