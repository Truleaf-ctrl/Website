import { useEffect } from 'react';

/* Shared motion layer: parallax, curtain image reveals, timeline draw.
   Uses the individual `translate` / `scale` CSS properties so it never fights with
   GSAP or CSS `transform` already used on the same elements.
   (Smooth scrolling and the scroll progress bar live in the app shell.) */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// parallax targets: [selector, speed, scale]
const IMG_TARGETS = [
  ['.sourcing-figure-media img', 0.1, 1.08],
  ['.cap-figure img', 0.08, 1.14],
  ['.impact-figure img', 0.12, 1.16],
  ['.mission-card--photo img', 0.06, 1.12],
  ['.careers-open__banner > img', 0.1, 1.16],
  ['.careers-apply__photo', 0.05, 1.1],
  ['.about-cta__bg', 0.1, 1.16],
  ['img[src*="about-origin-figure"]', 0.08, 1.14],
  ['[data-parallax]', 0.1, 1.12],
];
const BG_TARGETS = ['.careers-hero', '.supply-hero', '.catalogue-hero'];

export default function useMotion() {
  useEffect(() => {
    if (reduced()) return undefined;
    const cleanups = [];

    // ---- parallax
    const items = [];
    IMG_TARGETS.forEach(([sel, speed, scale]) => {
      document.querySelectorAll(sel).forEach((el) => {
        const p = el.parentElement;
        if (p && getComputedStyle(p).overflow === 'visible') p.style.overflow = 'hidden';
        el.style.scale = String(scale);
        el.style.willChange = 'translate';
        items.push({ el, speed, type: 'img' });
      });
    });
    BG_TARGETS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (getComputedStyle(el).backgroundImage !== 'none') items.push({ el, speed: 0.18, type: 'bg' });
      });
    });

    let ticking = false;
    let frame = 0;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      items.forEach(({ el, speed, type }) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        if (type === 'img') el.style.translate = `0 ${offset.toFixed(1)}px`;
        else el.style.backgroundPosition = `center calc(50% + ${offset.toFixed(1)}px)`;
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        frame = requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });

    // ---- one-shot reveals (curtain images, timeline draw)
    // A curtain image starts fully clipped, which the browser counts as "not visible", so it must be
    // observed through its (unclipped) parent, or it would never open.
    const revealOf = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (revealOf.get(e.target) || e.target).classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    document.querySelectorAll('.curtain, .buying-steps, .careers-open__banner, .careers-apply__photo').forEach((el) => {
      el.classList.add('curtain-ready');
      const clipped = el.matches('.curtain, .careers-open__banner, .careers-apply__photo');
      const watch = clipped && el.parentElement ? el.parentElement : el;
      if (watch !== el) revealOf.set(watch, el);
      io.observe(watch);
    });

    // stacked timeline (≤920px): each step reveals as it scrolls into view. Harmless on desktop.
    const stepIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            stepIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('.buying-steps li').forEach((li) => stepIo.observe(li));
    cleanups.push(() => {
      io.disconnect();
      stepIo.disconnect();
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
