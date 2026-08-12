import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReveal } from '../utils/useReveal.js';

// The study: a figure and its legend. The numbering is the point — each tick in
// the figure's printed margin is measured to sit on the baseline of the legend
// entry it refers to, so the leader line genuinely points at its own text.
export default function PlateStudy({ src, onError, alt, figure, items, isDark, ctaHref, ctaLabel }) {
  const revealRef = useReveal();
  const marginRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const [tickTops, setTickTops] = useState(null);

  const rule = isDark ? 'border-bone/25' : 'border-charcoal/20';
  const ruleFaint = isDark ? 'border-bone/12' : 'border-charcoal/10';
  const ink = isDark ? 'text-bone' : 'text-charcoal';
  const inkBody = isDark ? 'text-sand' : 'text-graphite';
  const inkNumber = isDark ? 'text-sage' : 'text-darkolive';
  const tickLine = isDark ? 'bg-sage/70' : 'bg-darkolive/60';
  const margin = isDark ? 'bg-graphite border-bone/20' : 'bg-sand border-charcoal/15';

  const measure = useCallback(() => {
    const marginBox = marginRef.current;
    const list = listRef.current;

    if (!marginBox || !list) {
      return;
    }

    // Only key the ticks once the figure sits beside the legend. Stacked, the
    // margin has no shared baseline to point at, so it falls back to even spacing.
    const sideBySide = marginBox.getBoundingClientRect().top < list.getBoundingClientRect().top + 8
      && window.matchMedia('(min-width: 1024px)').matches;

    if (!sideBySide) {
      setTickTops(null);
      return;
    }

    const marginTop = marginBox.getBoundingClientRect().top;
    const marginHeight = marginBox.offsetHeight;

    const tops = itemRefs.current.map((node) => {
      if (!node) {
        return null;
      }

      // Measured against the term itself, so the tick sits on the entry's
      // first line rather than a guessed offset from its block.
      const box = node.getBoundingClientRect();
      const target = box.top + box.height / 2 - marginTop;
      return Math.min(Math.max(target, 12), marginHeight - 12);
    });

    setTickTops(tops.every((value) => value !== null) ? tops : null);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, items]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure());

    if (observer && listRef.current) {
      observer.observe(listRef.current);
    }

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', onResize);
      observer?.disconnect();
    };
  }, [measure]);

  return (
    <div
      ref={revealRef}
      className="m1-armed grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch lg:gap-14"
    >
      <figure className="relative flex flex-col">
        <div className={`relative flex aspect-[4/5] flex-1 overflow-hidden border lg:aspect-auto ${rule}`}>
          <img
            src={src}
            onError={onError}
            alt={alt}
            loading="lazy"
            className="m1-photo h-full min-w-0 flex-1 object-cover object-center"
          />

          {/* Stacked, the ticks would key nothing, so the margin is desktop-only
              and the legend's own numerals carry the reference on a phone. */}
          <div
            ref={marginRef}
            className={`relative hidden w-14 shrink-0 border-l lg:block ${margin}`}
            aria-hidden="true"
          >
            {items.map(([term], index) => (
              <div
                key={term}
                className="m1-key absolute flex items-center gap-1.5 sm:gap-2"
                style={{
                  top:
                    tickTops && tickTops[index] != null
                      ? `${tickTops[index]}px`
                      : `${((index + 1) / (items.length + 1)) * 100}%`,
                  right: '0.6rem',
                  transform: 'translateY(-50%)',
                  '--key-index': index,
                }}
              >
                <span className={`m1-leader block h-px w-3.5 sm:w-5 ${tickLine}`} />
                <span className={`font-serif text-base italic leading-none ${inkNumber}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <figcaption className={`mt-3 font-serif text-sm italic ${inkNumber}`}>{figure}</figcaption>
      </figure>

      <div className="flex flex-col">
        <ol ref={listRef}>
          {items.map(([term, detail], index) => (
            <li
              key={term}
              className={`m1-key grid grid-cols-[2.5rem_1fr] gap-x-4 border-t py-5 first:border-t-0 first:pt-0 ${ruleFaint}`}
              style={{ '--key-index': index }}
            >
              <span className={`pt-0.5 font-serif text-lg italic ${inkNumber}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  className={`text-[0.74rem] uppercase tracking-[0.2em] ${ink}`}
                >
                  {term}
                </h3>
                <p className={`mt-2 max-w-[52ch] text-[0.95rem] leading-[1.7] ${inkBody}`}>{detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <a
          href={ctaHref}
          className={`mt-9 inline-flex items-center gap-3 self-start px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] transition-colors ${
            isDark ? 'bg-bone text-charcoal hover:bg-butter' : 'bg-charcoal text-bone hover:bg-darkolive'
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${
            isDark
              ? 'focus-visible:ring-butter focus-visible:ring-offset-charcoal'
              : 'focus-visible:ring-charcoal focus-visible:ring-offset-bone'
          }`}
        >
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
