// A plate in the atlas: a running head carrying the plate reference and what it
// depicts, a margin rail on wide screens, then the study itself.
export default function Plate({ id, plate, caption, heading, isDark, children }) {
  const ink = isDark ? 'text-bone' : 'text-charcoal';
  const inkSoft = isDark ? 'text-sage' : 'text-olive';
  const rule = isDark ? 'border-bone/25' : 'border-charcoal/20';

  // Multiply-blended grain disappears against charcoal, so the dark plate takes
  // the screen-blend variant instead.
  const grain = isDark ? 'm1-grain m1-grain-light' : 'm1-grain';

  return (
    <section id={id} className="relative isolate scroll-mt-16">
      <div className={`${grain} relative mx-auto max-w-[86rem] px-5 sm:px-8`}>
        <div
          className={`flex items-baseline justify-between gap-6 border-b py-4 text-[0.62rem] uppercase tracking-[0.28em] ${rule} ${inkSoft}`}
        >
          <span>{plate}</span>
          <span>{caption}</span>
        </div>

        <div className="grid gap-8 py-16 sm:py-24 lg:grid-cols-[7rem_minmax(0,1fr)] lg:gap-0">
          <div className="hidden lg:block">
            <div className={`sticky top-28 border-l pl-4 ${rule}`}>
              <p className={`font-serif text-2xl italic leading-none ${inkSoft}`}>{plate}</p>
            </div>
          </div>

          <div>
            <h2 className={`font-display text-[clamp(2rem,5.5vw,3.75rem)] uppercase leading-[0.96] ${ink}`}>
              {heading}
            </h2>

            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
