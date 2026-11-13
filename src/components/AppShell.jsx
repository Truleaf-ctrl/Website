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

// ?page=N only changes which slice of a list is shown: it is not a new page, so it neither
// remounts the page nor jumps to the top (the list scrolls itself into view instead).
export const withoutPageParam = (search) => {
  const params = new URLSearchParams(search);
  params.delete('page');
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

// New page: start at the top, or at the #section the link points to.
function ScrollManager() {
  const { pathname, search: fullSearch, hash } = useLocation();
  const search = withoutPageParam(fullSearch);
  const navType = useNavigationType();

  // navType is read through a ref so it never re-triggers the effect by itself:
  // only a new path, query (not ?page) or #hash counts as a new place to scroll to
  const navTypeRef = useRef(navType);
  navTypeRef.current = navType;
  useLayoutEffect(() => {
    if (navTypeRef.current === 'POP' && !hash) return undefined;
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
  }, [pathname, search, hash]);

  // ScrollTrigger needs fresh measurements after every page swap
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(t);
  }, [pathname, search]);

  return null;
}

export default function AppShell() {
  useSmoothScroll();
  const { pathname, search: fullSearch } = useLocation();
  const search = withoutPageParam(fullSearch);
  return (
    <ProductOverlayProvider>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <ScrollManager />
      {/* keyed so each page (and its effects) starts fresh when the URL changes */}
      <Outlet key={pathname + search} />
      <ScrollProgress />
    </ProductOverlayProvider>
  );
}
