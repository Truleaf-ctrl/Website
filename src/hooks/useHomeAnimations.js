import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ hero */

// Headline lines rise in, then the sub copy and buttons, once the page has loaded.
export function useHeroEntrance() {
  useLayoutEffect(() => {
    const lines = document.querySelectorAll('.hero-title .line span');
    const sub = document.querySelector('.hero-sub');
    const act = document.querySelector('.hero-actions');
    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 110 });
      gsap.set([sub, act], { autoAlpha: 0, y: 18 });
    });
    const run = () =>
      ctx.add(() =>
        gsap
          .timeline()
          .to(lines, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.1 })
          .to(sub, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=.55')
          .to(act, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=.5')
      );
    // first visit waits for images like the static page did; in-app navigation plays straight away
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });
    return () => {
      window.removeEventListener('load', run);
      ctx.revert();
    };
  }, []);
}

/**
 * Carousel with a slow Ken Burns zoom. Advances every 6s; pauses only while the
 * thumbnails are hovered (the hero is full-screen, so pausing on the whole hero meant it never advanced).
 */
export function useHeroCarousel(count) {
  const [cur, setCur] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const slideRefs = useRef([]);
  const prev = useRef(0);
  const timer = useRef(null);
  const curRef = useRef(0);
  curRef.current = cur;

  const restart = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => goTo((curRef.current + 1) % count), 6000);
  };
  const pause = () => clearTimeout(timer.current);

  const goTo = (i) => {
    if (i === curRef.current) return;
    setLeaving(curRef.current);
    setCur(i);
  };

  // runs before paint so the incoming slide never flashes at full opacity
  useLayoutEffect(() => {
    const slides = slideRefs.current;
    const from = prev.current;
    const tweens = [];
    if (from === cur) {
      tweens.push(gsap.to(slides[cur].querySelector('img'), { scale: 1.08, duration: 7, ease: 'none' }));
    } else {
      tweens.push(
        gsap.to(slides[from], {
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => setLeaving((l) => (l === from ? null : l)),
        }),
        gsap.fromTo(slides[cur], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.inOut' }),
        gsap.fromTo(slides[cur].querySelector('img'), { scale: 1 }, { scale: 1.08, duration: 7, ease: 'none' })
      );
    }
    prev.current = cur;
    restart();
    return () => tweens.forEach((t) => t.kill());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const slideClass = (i) => `hero-slide${i === cur || i === leaving ? ' is-active' : ''}`;
  const thumbClass = (i) => `hero-thumb${i === cur ? ' is-active' : ''}`;
  const slideRef = (i) => (el) => (slideRefs.current[i] = el);

  return { cur, goTo, slideClass, thumbClass, slideRef, pause, restart };
}

/* --------------------------------------------------------- scroll scenes */

/* base scroll reveals (were the inline script on index.html) */
export function useHomeReveals() {
  useEffect(() => {
    const listeners = [];
    const on = (el, type, fn) => {
      el.addEventListener(type, fn);
      listeners.push(() => el.removeEventListener(type, fn));
    };

    const ctx = gsap.context(() => {
      /* mission statement: fade up */
      gsap.set('#missionText, #missionLede', { autoAlpha: 0, y: 20 });
      gsap.to('#missionText, #missionLede', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#missionText', start: 'top 78%' },
      });

      /* count-up stats */
      const runCounters = (scope) => {
        scope.querySelectorAll('.counter').forEach((el) => {
          if (el.dataset.done) return;
          el.dataset.done = '1';
          const target = parseInt(el.dataset.target, 10);
          const suf = el.dataset.suffix || '';
          const o = { v: 0 };
          gsap.to(o, {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => (el.textContent = Math.round(o.v) + suf),
          });
        });
      };
      ScrollTrigger.create({
        trigger: '#missionCards',
        start: 'top 85%',
        once: true,
        onEnter: () => runCounters(document.getElementById('missionCards')),
      });
      gsap.set('#missionCards .mission-card', { autoAlpha: 0, y: 34 });
      gsap.to('#missionCards .mission-card', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '#missionCards', start: 'top 85%' },
      });

      /* sourcing: heading + aside fade up, figure + card reveal, stats count up */
      gsap.set('.sourcing-title, .sourcing-aside > *', { autoAlpha: 0, y: 26 });
      gsap.to('.sourcing-title', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.sourcing-head', start: 'top 82%' },
      });
      gsap.to('.sourcing-aside > *', {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.sourcing-head', start: 'top 82%' },
      });
      gsap.set('#sourcingFigure', { autoAlpha: 0, y: 40 });
      gsap.to('#sourcingFigure', {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#sourcingFigure', start: 'top 80%' },
      });
      ScrollTrigger.create({
        trigger: '.sourcing-stats',
        start: 'top 88%',
        once: true,
        onEnter: () => runCounters(document.querySelector('.sourcing')),
      });

      /* capabilities: title fade-up, figure + cards stagger reveal */
      gsap.set('#capabilitiesTitle', { autoAlpha: 0, y: 24 });
      gsap.to('#capabilitiesTitle', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#capabilitiesTitle', start: 'top 85%' },
      });
      gsap.set('#capRow .cap-figure, #capRow .cap-card', { autoAlpha: 0, y: 30 });
      gsap.to('#capRow .cap-figure, #capRow .cap-card', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '#capRow', start: 'top 82%' },
      });

      /* certification strip: statement + badges fade up */
      gsap.set('.certs-statement, .cert-badge', { autoAlpha: 0, y: 20 });
      gsap.to('.certs-statement', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.certs-statement', start: 'top 85%' },
      });
      gsap.to('.cert-badge', {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.certs-row', start: 'top 88%' },
      });

      /* featured categories title */
      gsap.set('#trendingTitle', { autoAlpha: 0, y: 24 });
      gsap.to('#trendingTitle', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#trendingTitle', start: 'top 85%' },
      });

      /* impact banner: figure reveal */
      gsap.set('#impactFigure', { autoAlpha: 0, y: 40 });
      gsap.to('#impactFigure', {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#impactFigure', start: 'top 82%' },
      });

      /* trending products title */
      gsap.set('#productsTitle', { autoAlpha: 0, y: 24 });
      gsap.to('#productsTitle', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#productsTitle', start: 'top 85%' },
      });

      /* magnetic buttons: pill CTAs ease toward the cursor within a small radius */
      const strength = 0.35;
      gsap.utils.toArray('.btn-brand, .btn-primary-img').forEach((btn) => {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
        on(btn, 'mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * strength);
          yTo((e.clientY - r.top - r.height / 2) * strength);
        });
        on(btn, 'mouseleave', () => {
          xTo(0);
          yTo(0);
        });
      });
    });

    return () => {
      listeners.forEach((off) => off());
      ctx.revert();
    };
  }, []);
}

/* animations for the Sanity-fed rows run once their cards exist */
export function useSanityRowReveals(ready) {
  useEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      gsap.set('#trendingRow .category-card', { autoAlpha: 0, y: 24 });
      gsap.to('#trendingRow .category-card', {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '#trendingRow', start: 'top 82%' },
      });
      gsap.set('#productsRow .trend-card', { autoAlpha: 0, y: 30 });
      gsap.to('#productsRow .trend-card', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '#productsRow', start: 'top 82%' },
      });
      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, [ready]);
}

/* Homepage GSAP scenes, layered on top of the base reveals (was assets/home-motion.js). */
export function useHomeScenes() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      // 1. Scroll-scrubbed word fill on the sustainability headline (words are split in the markup)
      const title = document.getElementById('missionText');
      if (title) {
        gsap.fromTo(
          title.querySelectorAll('.word'),
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: title, start: 'top 80%', end: 'bottom 50%', scrub: 0.6 },
          }
        );
      }

      // 2. Buying timeline: line is drawn by scroll, steps light up as it passes
      const steps = document.querySelector('.buying-steps');
      if (steps) {
        const items = gsap.utils.toArray('.buying-steps li');
        steps.classList.add('gsap-line');
        steps.style.setProperty('--line', 0);
        ScrollTrigger.create({
          trigger: steps,
          start: 'top 72%',
          end: 'bottom 70%',
          scrub: 0.6,
          onUpdate: (self) => {
            steps.style.setProperty('--line', self.progress);
            items.forEach((li, i) => li.classList.toggle('is-active', self.progress >= i / (items.length - 1) - 0.02));
          },
        });
      }

      // 3. Tractor field expands from an inset card to full bleed as you arrive
      const fig = document.getElementById('impactFigure');
      if (fig) {
        gsap.fromTo(
          fig,
          { scale: 0.9, borderRadius: 36 },
          {
            scale: 1,
            borderRadius: 0,
            ease: 'none',
            transformOrigin: '50% 50%',
            scrollTrigger: { trigger: '.impact', start: 'top 90%', end: 'top 20%', scrub: 0.6 },
          }
        );
        gsap.from('.impact-cta', {
          y: 50,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.impact', start: 'top 35%', once: true },
        });
      }

      // 4. Capabilities: photo slides in from the left, cards from the right
      gsap.from('#capRow .cap-figure', {
        x: -50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#capRow', start: 'top 80%', once: true },
      });
      gsap.from('#capRow .cap-col', {
        x: 50,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '#capRow', start: 'top 80%', once: true },
      });

      // 5. Certificate badges flip in
      gsap.from('.cert-badge-circle', {
        rotationY: 90,
        scale: 0.7,
        duration: 0.7,
        ease: 'back.out(1.6)',
        stagger: 0.08,
        transformPerspective: 600,
        scrollTrigger: { trigger: '.certs-row', start: 'top 85%', once: true },
      });

      // 6a. Sourcing photo: opens up from a rounded inset window while the image eases out of a zoom
      const sMedia = document.querySelector('.sourcing-figure-media');
      if (sMedia) {
        gsap.fromTo(
          sMedia,
          { clipPath: 'inset(14% 10% 14% 10% round 36px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 36px)',
            ease: 'none', // end on the frame's own corner radius
            scrollTrigger: { trigger: '#sourcingFigure', start: 'top 100%', end: 'top 55%', scrub: 0.6 },
          }
        );
        // end at 1.08, not 1: useMotion enlarges this image by 1.08 so its parallax shift never exposes the frame
        gsap.fromTo(
          sMedia.querySelector('img'),
          { scale: 1.3 },
          {
            scale: 1.08,
            ease: 'none',
            scrollTrigger: { trigger: '#sourcingFigure', start: 'top 100%', end: 'top 55%', scrub: 0.6 },
          }
        );
      }

      // 6. Sourcing card slides over the photo
      gsap.from('.sourcing-card', {
        y: 40,
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#sourcingFigure', start: 'top 45%', once: true },
      });

      // 7. Sourcing headline: lines lift in from behind a mask
      const st = document.querySelector('.sourcing-title');
      if (st) {
        st.style.overflow = 'hidden';
        gsap.from(st, {
          yPercent: 20,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.sourcing-head', start: 'top 82%', once: true },
        });
      }

      ScrollTrigger.refresh();
    });
    return () => {
      ctx.revert();
      const steps = document.querySelector('.buying-steps');
      if (steps) steps.classList.remove('gsap-line');
    };
  }, []);
}

/* mobile sticky "Request a quote" shows once the hero has scrolled away */
export function useStickyCta(heroId) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((e) => setOn(!e[0].isIntersecting), { threshold: 0.1 });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);
  return on;
}
