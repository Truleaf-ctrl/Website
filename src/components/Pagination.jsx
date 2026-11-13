import { Link, useLocation } from 'react-router-dom';
import { getLenis } from './AppShell';

// bring the top of a list into view after a page change (works with the smooth-scroll library)
export function scrollToList(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: -24 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Numbered pagination driven by a ?page=N query parameter, so every page has its own
// link (shareable, crawlable, back button works). Renders nothing for a single page.
//   page / totalPages: 1-based
//   onNavigate: called after a page link is followed (used to scroll the list into view)
function pageList(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => pages.add(n));
  if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => pages.add(n));
  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push('gap' + n);
    out.push(n);
  });
  return out;
}

export default function Pagination({ page, totalPages, onNavigate, label = 'Pagination' }) {
  const location = useLocation();
  if (totalPages <= 1) return null;

  const to = (n) => {
    const params = new URLSearchParams(location.search);
    if (n <= 1) params.delete('page');
    else params.set('page', String(n));
    const qs = params.toString();
    return { pathname: location.pathname, search: qs ? `?${qs}` : '' };
  };

  const go = () => onNavigate && onNavigate();
  const prev = page > 1;
  const next = page < totalPages;

  return (
    <nav className="pager" aria-label={label}>
      {prev ? (
        <Link className="pager__step" to={to(page - 1)} rel="prev" onClick={go}>
          <span aria-hidden="true">←</span> <span className="pager__step-text">Previous</span>
        </Link>
      ) : (
        <span className="pager__step is-disabled" aria-disabled="true">
          <span aria-hidden="true">←</span> <span className="pager__step-text">Previous</span>
        </span>
      )}

      <ol className="pager__pages">
        {pageList(page, totalPages).map((n) =>
          typeof n === 'string' ? (
            <li key={n} className="pager__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={n}>
              {n === page ? (
                <span className="pager__page is-current" aria-current="page">
                  <span className="visually-hidden">Page </span>
                  {n}
                </span>
              ) : (
                <Link className="pager__page" to={to(n)} onClick={go}>
                  <span className="visually-hidden">Page </span>
                  {n}
                </Link>
              )}
            </li>
          )
        )}
      </ol>
      <p className="pager__status">
        Page {page} of {totalPages}
      </p>

      {next ? (
        <Link className="pager__step" to={to(page + 1)} rel="next" onClick={go}>
          <span className="pager__step-text">Next</span> <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className="pager__step is-disabled" aria-disabled="true">
          <span className="pager__step-text">Next</span> <span aria-hidden="true">→</span>
        </span>
      )}
    </nav>
  );
}

export function usePageParam(searchParams, totalItems, pageSize) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const raw = parseInt(searchParams.get('page'), 10);
  const page = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), totalPages) : 1;
  return { page, totalPages, start: (page - 1) * pageSize, end: page * pageSize };
}
