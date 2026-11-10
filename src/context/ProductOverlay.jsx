import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


// Product detail overlay (the bottom sheet). Shared by the product listing page,
// the search results page and the search type-ahead: call `openProduct(data)`.
//
// data keys: productName, productCategory, productImage, productDesc, productBotanical, productSourced,
// plus the optional productPackaging, productGrades, productShelf, productStorage,
// productCerts (comma-separated) and productChart (array of { size, basis }),
// productGrade and productCategorySlug (enable the full breadcrumb).

const OverlayContext = createContext({ openProduct: () => {}, closeProduct: () => {} });
export const useProductOverlay = () => useContext(OverlayContext);

// longer text goes into expandable rows, one sentence per line
const sentences = (text) => String(text || '').split(/(?<=\.)\s+(?=[A-Z])/);

function Breadcrumb({ data, onSamePage }) {
  const sep = (
    <span className="overlay__sep" aria-hidden="true">
      /
    </span>
  );
  const category = data.productCategory || '';
  if (data.productGrade && data.productCategorySlug) {
    const label = data.productGrade === 'conventional' ? 'Conventional Ingredients' : 'Organic Ingredients';
    const listing = `/products-coconut?category=${encodeURIComponent(data.productCategorySlug)}&grade=${data.productGrade}`;
    return (
      <>
        <Link to="/catalogue">Products</Link>
        {sep}
        <Link to={`/catalogue#${data.productGrade}`}>{label}</Link>
        {sep}
        <Link to={listing} className="is-current" onClick={(e) => onSamePage(e, listing)}>
          {category}
        </Link>
      </>
    );
  }
  return (
    <>
      <Link to="/catalogue">Products</Link>
      {category && (
        <>
          {sep}
          <span className="is-current">{category}</span>
        </>
      )}
    </>
  );
}

function Accordion({ label, text, open = false }) {
  if (!text) return null;
  return (
    <details className="overlay__acc" open={open}>
      <summary>{label}</summary>
      <div className="overlay__acc-body">
        {sentences(text).map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
    </details>
  );
}

// long descriptions show about three lines, with a toggle for the rest
function Description({ text }) {
  const [open, setOpen] = useState(false);
  const long = String(text || '').length > 190;
  return (
    <div className="overlay__desc-wrap">
      <p className={`overlay__desc${long && !open ? ' is-clamped' : ''}`}>{text || ''}</p>
      {long && (
        <button type="button" className="overlay__more" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

function ProductOverlay({ data, isOpen, onClose }) {
  const location = useLocation();
  const closeRef = useRef(null);
  const d = data || {};

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen, data]);

  // keep Tab / Shift+Tab inside the open sheet (it is a modal dialog)
  const panelRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.disabled && el.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!panelRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // the breadcrumb's last step points at the page the overlay is open on: just close the overlay
  const onSamePage = (e, href) => {
    const target = new URL(href, window.location.origin);
    if (target.pathname === location.pathname && target.search === location.search) {
      e.preventDefault();
      onClose();
    }
  };

  const facts = [
    ['Origin', d.productSourced],
    ['Botanical name', d.productBotanical, true],
    ['Shelf life', d.productShelf],
    ['Storage', d.productStorage],
  ].filter(([, v]) => v);

  const certs = String(d.productCerts || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  const chart = Array.isArray(d.productChart) ? d.productChart : [];

  return (
    <div className={`overlay${isOpen ? ' is-open' : ''}`} id="productOverlay" aria-hidden={!isOpen} {...(!isOpen ? { inert: '' } : {})}>
      <div className="overlay__backdrop" onClick={onClose}></div>
      <div className="overlay__panel" role="dialog" aria-modal="true" aria-labelledby="overlayTitle" ref={panelRef}>
        <div className="overlay__top">
          <p className="overlay__breadcrumb">{data && <Breadcrumb data={d} onSamePage={onSamePage} />}</p>
          <button className="overlay__close" type="button" aria-label="Close" onClick={onClose} ref={closeRef}>
            <span>Close</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {/* keyed by product so the accordions start closed for every product */}
        <div className="overlay__content" key={d.productName || ''}>
          <div className="overlay__image">
            <img src={d.productImage || undefined} alt={d.productName || ''} />
          </div>
          <div className="overlay__details">
            <div className="overlay__head">
              <h2 className="overlay__title" id="overlayTitle">
                {d.productName || ''}
              </h2>
            </div>
            <ul className="overlay__chips" hidden={!certs.length} aria-label="Certifications">
              {certs.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <Description text={d.productDesc} />
            <dl className="overlay__specs" hidden={!facts.length}>
              {facts.map(([label, v, italic]) => (
                <div key={label} className="overlay__spec">
                  <dt>{label}</dt>
                  <dd className={italic ? 'is-italic' : ''}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="overlay__acc-list">
              <Accordion label="Available packaging" text={d.productPackaging} open />
              <Accordion label="Grade options" text={d.productGrades} open />
              {chart.length > 0 && (
                <details className="overlay__acc">
                  <summary>Size &amp; grade chart</summary>
                  <div className="overlay__acc-body">
                    <table className="overlay__chart-table">
                      <thead>
                        <tr>
                          <th>Size / caliber</th>
                          <th>Specification / basis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chart.map((r, i) => (
                          <tr key={i}>
                            <td>{r.size}</td>
                            <td>{r.basis || '–'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
            </div>
            <div className="overlay__actions">
              <Link to="/contact" className="btn btn--primary overlay__cta" onClick={onClose}>
                Enquire
              </Link>
              <a
                className="overlay__cta-alt"
                href={`mailto:info@truleaf.in?subject=${encodeURIComponent(`Spec sheet request: ${d.productName || 'product'}`)}`}
              >
                Request spec sheet
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductOverlayProvider({ children }) {
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // the sheet's markup is only mounted once a product is opened (its styles only exist on inner pages)
  const [mounted, setMounted] = useState(false);
  const lastFocused = useRef(null);
  const location = useLocation();

  const openProduct = useCallback((next) => {
    lastFocused.current = document.activeElement;
    setData(next);
    setMounted(true);
    // open on the next frame so the first opening slides in like every later one
    requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)));
  }, []);

  const closeProduct = useCallback(() => {
    setIsOpen((wasOpen) => {
      if (wasOpen) {
        const el = lastFocused.current;
        if (el && document.contains(el)) setTimeout(() => el.focus(), 0);
      }
      return false;
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeProduct();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeProduct]);

  // navigating anywhere closes the sheet; leaving the page removes it
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    setMounted(false);
  }, [location.pathname]);

  return (
    <OverlayContext.Provider value={{ openProduct, closeProduct }}>
      {children}
      {mounted && <ProductOverlay data={data} isOpen={isOpen} onClose={closeProduct} />}
    </OverlayContext.Provider>
  );
}
