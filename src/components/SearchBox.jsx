import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Highlight from './Highlight';
import { useProductOverlay } from '../context/ProductOverlay';
import {
  loadSearchData,
  termsOf,
  findResults,
  categoryHref,
  productHref,
  postHref,
  resultsHref,
  overlayDataFromSearch,
} from '../lib/search';

const MAX_CATEGORIES = 3;
const MAX_PRODUCTS = 4;
const MAX_POSTS = 3;

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
    <line x1="13.6" y1="13.6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// Builds the flat list of options (for keyboard navigation) plus what to render.
function buildSuggestions(data, q) {
  const terms = termsOf(q);
  const { categories, products, posts } = findResults(data, terms);
  const shown = {
    categories: categories.slice(0, MAX_CATEGORIES),
    products: products.slice(0, MAX_PRODUCTS),
    posts: posts.slice(0, MAX_POSTS),
  };
  const empty = !shown.categories.length && !shown.products.length && !shown.posts.length;
  const options = [];
  if (empty) {
    data.products.slice(0, 4).forEach((p) => options.push({ kind: 'chip', href: resultsHref(p.name), title: p.name }));
  } else {
    shown.categories.forEach((c) =>
      options.push({
        kind: 'item',
        group: 'Categories',
        href: categoryHref(c),
        thumb: c.thumb,
        title: c.name,
        meta: 'Category',
      })
    );
    shown.products.forEach((p) =>
      options.push({
        kind: 'item',
        group: 'Products',
        href: productHref(p),
        thumb: p.thumb,
        title: p.name,
        meta: p.category || 'Product',
        product: p,
      })
    );
    shown.posts.forEach((p) =>
      options.push({
        kind: 'item',
        group: 'Articles',
        href: postHref(p),
        thumb: p.thumb,
        title: p.title,
        meta: p.category || 'Article',
      })
    );
    options.push({ kind: 'all', href: resultsHref(q), total: categories.length + products.length + posts.length });
  }
  return { terms, empty, options };
}

/**
 * The catalogue/search form with its type-ahead dropdown.
 * Submitting goes to /search?q=…; product suggestions open the product overlay.
 */
export default function SearchBox({ defaultValue = '', inputId, placeholder, ariaLabel }) {
  const navigate = useNavigate();
  const { openProduct } = useProductOverlay();
  const listId = `search-suggest-${useId().replace(/:/g, '')}`;
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(null); // { q, terms, empty, options }
  const [active, setActive] = useState(-1);
  const seq = useRef(0);
  const timer = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => setValue(defaultValue), [defaultValue]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  async function render(q) {
    q = q.trim();
    const mine = ++seq.current;
    if (!q) {
      close();
      return;
    }
    setOpen(true);
    let data;
    try {
      data = await loadSearchData();
    } catch {
      close();
      return;
    }
    if (mine !== seq.current) return; // a newer keystroke superseded this render
    setResult({ q, ...buildSuggestions(data, q) });
    setActive(-1);
  }

  const choose = (opt, e) => {
    if (opt.product) {
      e?.preventDefault();
      openProduct(overlayDataFromSearch(opt.product));
      return;
    }
    if (e) return; // a real click on a <Link> navigates by itself
    navigate(opt.href);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    const options = result?.options || [];
    if (!open || !options.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1 >= options.length ? 0 : a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a <= 0 ? options.length - 1 : a - 1));
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      choose(options[active]); // product rows open the overlay, everything else navigates
    }
  };

  useEffect(() => {
    if (active >= 0) optionRefs.current[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onSubmit = (e) => {
    e.preventDefault();
    close();
    navigate(resultsHref(value));
  };

  const optionProps = (i) => ({
    role: 'option',
    'aria-selected': i === active,
    id: `${listId}-o${i}`,
    ref: (el) => (optionRefs.current[i] = el),
    onMouseMove: () => i !== active && setActive(i),
  });

  const renderList = () => {
    if (!result) return null;
    const { q, terms, empty, options } = result;
    if (empty) {
      return (
        <div className="search-suggest__empty">
          <span className="search-suggest__empty-icon">
            <SearchIcon />
          </span>
          <p className="search-suggest__empty-title">No matches for “{q}”</p>
          <p className="search-suggest__empty-body">Check the spelling or try a broader word. Popular searches:</p>
          <div className="search-suggest__chips">
            {options.map((o, i) => (
              <Link
                key={o.href}
                to={o.href}
                className={`search-suggest__chip${i === active ? ' is-active' : ''}`}
                onClick={close}
                {...optionProps(i)}
              >
                {o.title}
              </Link>
            ))}
          </div>
        </div>
      );
    }
    let lastGroup = null;
    return options.map((o, i) => {
      if (o.kind === 'all') {
        return (
          <Link
            key="all"
            to={o.href}
            className={`search-suggest__all${i === active ? ' is-active' : ''}`}
            onClick={close}
            {...optionProps(i)}
          >
            <span>
              See all {o.total} result{o.total === 1 ? '' : 's'} for “{q}”
            </span>
            <Arrow />
          </Link>
        );
      }
      const heading =
        o.group !== lastGroup ? (
          <p className="search-suggest__group" role="presentation">
            {o.group}
          </p>
        ) : null;
      lastGroup = o.group;
      return (
        <Fragment key={`${o.group}-${i}`}>
          {heading}
          <Link
            to={o.href}
            className={`search-suggest__item${i === active ? ' is-active' : ''}`}
            onClick={(e) => (o.product ? choose(o, e) : close())}
            {...optionProps(i)}
          >
            <span className="search-suggest__thumb">
              {o.thumb ? <img src={o.thumb} alt="" loading="lazy" /> : null}
            </span>
            <span className="search-suggest__text">
              <span className="search-suggest__name">
                <Highlight text={o.title} terms={terms} />
              </span>
              <span className="search-suggest__meta">{o.meta || ''}</span>
            </span>
          </Link>
        </Fragment>
      );
    });
  };

  return (
    <form className="catalogue-search" role="search" action="/search" method="get" onSubmit={onSubmit}>
      <div className="catalogue-search__field">
        <svg
          className="catalogue-search__icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6.5" stroke="#45454c" strokeWidth="1.6" />
          <line x1="13.6" y1="13.6" x2="18" y2="18" stroke="#45454c" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          name="q"
          id={inputId}
          className="catalogue-search__input"
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? `${listId}-o${active}` : undefined}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            clearTimeout(timer.current);
            const q = e.target.value;
            timer.current = setTimeout(() => render(q), 90);
          }}
          onFocus={() => value.trim() && render(value)}
          onBlur={() => setTimeout(close, 120)}
          onKeyDown={onKeyDown}
        />
      </div>
      <button type="submit" className="catalogue-search__submit" aria-label="Search">
        <img src="/assets/icons/arrow-right.svg" alt="" />
      </button>
      <div
        className="search-suggest"
        id={listId}
        role="listbox"
        aria-label="Search suggestions"
        hidden={!open}
        // keep focus in the input while interacting with the list
        onMouseDown={(e) => e.preventDefault()}
      >
        {open && renderList()}
      </div>
    </form>
  );
}
