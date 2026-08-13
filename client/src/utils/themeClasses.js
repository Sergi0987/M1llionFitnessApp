// The dashboard's token vocabulary, extended from the same M1LLION brand
// tokens as the public site (see DESIGN.md). Panel sits one step lighter
// than the page in dark mode (graphite on charcoal) and one step warmer in
// light mode (paper on bone); subPanel and inputs recess back to the page
// tone, mirroring the plate's own ground/panel relationship.
export function getThemeClasses(theme) {
  const isDark = theme === 'dark';

  return {
    isDark,
    ink: isDark ? 'text-bone' : 'text-charcoal',
    eyebrow: isDark ? 'text-sage' : 'text-olive',
    muted: isDark ? 'text-sand' : 'text-graphite',
    panel: isDark ? 'border-bone/20 bg-graphite' : 'border-charcoal/20 bg-paper',
    subPanel: isDark ? 'bg-charcoal' : 'bg-bone',
    input: isDark
      ? 'border-bone/20 bg-charcoal text-bone placeholder:text-stone'
      : 'border-charcoal/20 bg-bone text-charcoal placeholder:text-stone',
    divider: isDark ? 'border-bone/12' : 'border-charcoal/10',
  };
}
