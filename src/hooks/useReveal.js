import { useEffect } from 'react';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fades `.reveal` / `.reveal-stagger` elements in as they scroll into view.
 * Re-scans whenever `deps` change, so content rendered after a fetch is picked up too.
 */
export default function useReveal(deps = []) {
  useEffect(() => {
    const targets = [...document.querySelectorAll('.reveal:not(.is-visible), .reveal-stagger:not(.is-visible)')];
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          // Reveal on intersect, or if a fast/jump scroll already carried the
          // element above the viewport before it ever intersected.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Some pages reveal a whole staggered list at once as soon as its data arrives.
export function revealAllStagger() {
  document.querySelectorAll('.reveal-stagger').forEach((el) => el.classList.add('is-visible'));
}

export function revealAll() {
  document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => el.classList.add('is-visible'));
}
