import { useReveal } from '../utils/useReveal.js';

// The study: a figure and its legend. The figure is shown whole and unmarked;
// the numbering lives entirely in the legend beside it.
export default function PlateStudy({ src, onError, alt, figure, items, isDark, ctaHref, ctaLabel }) {
  const revealRef = useReveal();

  const rule = isDark ? 'border-bone/25' : 'border-charcoal/20';
  const ruleFaint = isDark ? 'border-bone/12' : 'border-charcoal/10';
  const ink = isDark ? 'text-bone' : 'text-charcoal';
  const inkBody = isDark ? 'text-sand' : 'text-graphite';
  const inkNumber = isDark ? 'text-sage' : 'text-darkolive';

  return (
    <div
      ref={revealRef}
      className="m1-armed grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch lg:gap-14"
    >
      <figure className="relative flex flex-col">
        <div className={`relative flex-1 overflow-hidden border ${rule}`}>
          <img
            src={src}
            onError={onError}
            alt={alt}
            loading="lazy"
            className="m1-photo h-full w-full object-cover object-top"
          />
        </div>

        <figcaption className={`mt-3 font-serif text-sm italic ${inkNumber}`}>{figure}</figcaption>
      </figure>

      <div className="flex flex-col">
        <ol>
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
                <h3 className={`text-[0.74rem] uppercase tracking-[0.2em] ${ink}`}>{term}</h3>
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
