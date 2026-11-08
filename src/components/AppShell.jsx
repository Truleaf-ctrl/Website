import { useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductOverlayProvider } from '../context/ProductOverlay';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// one Lenis instance for the whole app (inertia scrolling, drives GSAP ScrollTrigger)
let lenis = null;
export const getLenis = () => lenis;

function useSmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return undefined;
    document.documentElement.classList.add('js-motion');
    lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      anchors: true,
      prevent: (node) => node.closest && node.closest('.overlay__panel, .search-suggest, textarea'),
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
      document.documentElement.classList.remove('js-motion');
    };
  }, []);
}

function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  if (typeof window !== 'undefined' && reducedMotion()) return null;
  return <div className="scroll-progress" aria-hidden="true" ref={bar} />;
}

// New page: start at the top, or at the #section the link points to.
function ScrollManager() {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    if (navType === 'POP' && !hash) return;
    const toTop = () => {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    };
    if (!hash) {
      toTop();
      return;
    }
    // wait a frame so the page (and its stylesheet) is in place before measuring
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return toTop();
      if (lenis) lenis.scrollTo(el, { immediate: true });
      else el.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, search, hash, navType]);

  // ScrollTrigger needs fresh measurements after every page swap
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(t);
  }, [pathname, search]);

  return null;
}

export default function AppShell() {
  useSmoothScroll();
  const { pathname, search } = useLocation();
  return (
    <ProductOverlayProvider>
      <ScrollManager />
      {/* keyed so each page (and its effects) starts fresh when the URL changes */}
      <Outlet key={pathname + search} />
      <ScrollProgress />
    </ProductOverlayProvider>
  );
}
