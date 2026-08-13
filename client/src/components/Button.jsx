// Square, olive-filled primary — a fixed color so it reads correctly on both
// page grounds without needing to know the theme. Secondary and danger sit on
// the page ground directly, so those two do need isDark.
export default function Button({ children, className = '', variant = 'primary', isDark = false, ...props }) {
  const styles = {
    primary: 'bg-olive text-bone hover:bg-darkolive',
    secondary: isDark
      ? 'border border-bone/25 text-bone hover:border-bone/50'
      : 'border border-charcoal/25 text-charcoal hover:border-charcoal/50',
    danger: isDark
      ? 'border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
      : 'border border-red-600/30 bg-red-50 text-red-700 hover:bg-red-100',
  };

  return (
    <button
      className={`px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
