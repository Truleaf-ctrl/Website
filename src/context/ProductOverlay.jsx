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

function Accordion({ label, text }) {
  if (!text) return null;
  return (
    <details className="overlay__acc">
      <summary>{label}</summary>
      <div className="overlay__acc-body">
        {sentences(text).map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
    </details>
  );
}

function ProductOverlay({ data, isOpen, onClose }) {
  const location = useLocation();
  const closeRef = useRef(null);
  const d = data || {};

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen, data]);

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
    <div className={`overlay${isOpen ? ' is-open' : ''}`} id="productOverlay" aria-hidden={!isOpen}>
      <div className="overlay__backdrop" onClick={onClose}></div>
      <div className="overlay__panel" role="dialog" aria-modal="true" aria-labelledby="overlayTitle">
        <div className="overlay__top">
          <p className="overlay__breadcrumb">{data && <Breadcrumb data={d} onSamePage={onSamePage} />}</p>
          <button className="overlay__close" type="button" aria-label="Close" onClick={onClose} ref={closeRef}>
            <img src="/assets/icons/overlay-arrow.svg" alt="" />
          </button>
        </div>
        {/* keyed by product so the accordions start closed for every product */}
        <div className="overlay__content" key={d.productName || ''}>
          <div className="overlay__image">
            <img src={d.productImage || undefined} alt={d.productName || ''} />
          </div>
          <div className="overlay__details">
            <h2 className="overlay__title" id="overlayTitle">
              {d.productName || ''}
            </h2>
            <p className="overlay__desc">{d.productDesc || ''}</p>
            <div className="overlay__facts" hidden={!facts.length}>
              {facts.map(([label, v, italic]) => (
                <div key={label} className={`overlay__fact${String(v).length > 42 ? ' overlay__fact--wide' : ''}`}>
                  <span className="overlay__fact-label">{label}</span>
                  <span className={`overlay__fact-value${italic ? ' is-italic' : ''}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="overlay__certs" hidden={!certs.length}>
              <p className="overlay__block-label">Certifications</p>
              <ul className="overlay__chips">
                {certs.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="overlay__acc-list">
              <Accordion label="Available packaging" text={d.productPackaging} />
              <Accordion label="Grade options" text={d.productGrades} />
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
