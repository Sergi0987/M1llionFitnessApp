import { useEffect, useRef } from 'react';

// Adds the drawn state once the element has been reached. Everything stays
// visible without JS: the armed/drawn pair only ever hides content while the
// observer is live, and reduced-motion users skip the transition entirely.
export function useReveal(threshold = 0.2) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('m1-drawn');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.classList.add('m1-drawn');
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
