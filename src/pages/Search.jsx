import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import SearchBox from '../components/SearchBox';
import usePage from '../hooks/usePage';
import useReveal, { revealAllStagger } from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
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
import { SITE_CSS } from '../styles/site';

const plural = (n, word, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

function ResultSection({ id, alt, eyebrow, heading, body, show, children }) {
  return (
    <section
      className={`catalogue-section${alt ? ' catalogue-section--alt' : ''} search-results`}
      id={id}
      hidden={!show}
    >
      <div className="content-wrap catalogue-section__grid">
        <div className="catalogue-section__intro">
          <p className="catalogue-eyebrow">{eyebrow}</p>
          <h2 className="catalogue-section__heading">{heading}</h2>
          <p className="catalogue-section__body" id={`${id}Body`}>
            {body}
          </p>
        </div>
        <div className="catalogue-section__list reveal-stagger" id={`${id}List`}>
          {children}
        </div>
      </div>
    </section>
  );
}

export default function Search() {
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim();
  const terms = termsOf(query);
  const { openProduct } = useProductOverlay();

  // status: 'loading' | 'ready' | 'error'
  const [state, setState] = useState({ status: 'loading', data: null });
  const [tab, setTab] = useState('all');

  usePage({
    title: query ? `“${query}” | Search | Truleaf` : 'Search | Truleaf',
    description: 'Search Truleaf products and articles.',
    path: '/search',
    robots: 'noindex, follow',
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  useEffect(() => {
    let alive = true;
    loadSearchData()
      .then((data) => alive && setState({ status: 'ready', data }))
      .catch((err) => {
        console.error('Could not load search results from Sanity', err);
        if (alive) setState({ status: 'error', data: null });
      });
    return () => {
      alive = false;
    };
  }, []);

  const ready = state.status === 'ready';
  const hits = ready && terms.length ? findResults(state.data, terms) : { categories: [], products: [], posts: [] };
  const total = hits.categories.length + hits.products.length + hits.posts.length;

  // filter pills: All / Categories / Products / Articles (only groups that have hits)
  const groups = [
    { key: 'all', label: 'All', count: total },
    ...(hits.categories.length ? [{ key: 'categories', label: 'Categories', count: hits.categories.length }] : []),
    ...(hits.products.length ? [{ key: 'products', label: 'Products', count: hits.products.length }] : []),
    ...(hits.posts.length ? [{ key: 'blog', label: 'Articles', count: hits.posts.length }] : []),
  ];
  const showGroup = (key, count) => count > 0 && (tab === 'all' || tab === key);

  useEffect(() => {
    if (ready) requestAnimationFrame(revealAllStagger);
  }, [ready, tab]);

  let summary;
  if (state.status === 'loading') summary = 'Searching…';
  else if (state.status === 'error') summary = 'Sorry, search is unavailable right now. Please try again shortly.';
  else if (!terms.length) summary = 'Search our products and articles.';
  else if (!total)
    summary = (
      <>
        No results for <strong>“{query}”</strong>
      </>
    );
  else
    summary = (
      <>
        <strong>{plural(total, 'result')}</strong> for <strong>“{query}”</strong>
      </>
    );

  const empty = ready && (!terms.length || !total);
  const emptyTitle = !terms.length ? 'What are you looking for?' : `Nothing found for “${query}”`;
  const emptyBody = !terms.length
    ? 'Try one of these popular searches, or type a product, ingredient or topic above.'
    : 'Check the spelling, try a more general word, or start from one of these.';
  const popular = ready ? state.data.products.slice(0, 5).map((p) => p.name) : [];

  return (
    <>
      <header className="catalogue-hero catalogue-hero--search">
        <Nav />
        <div className="catalogue-hero__content reveal">
          <h1 className="catalogue-hero__title">Search results</h1>
          <SearchBox
            defaultValue={query}
            inputId="searchInput"
            placeholder="Search for premium spices, nuts, or seeds..."
            ariaLabel="Search products"
          />
          <p className="search-summary" id="searchSummary" aria-live="polite">
            {summary}
          </p>
        </div>
      </header>

      <main id="main">

      <div className="search-tabs-bar" id="searchTabsBar" hidden={!(ready && total > 0 && groups.length > 2)}>
        <div className="content-wrap search-tabs" id="searchTabs" role="group" aria-label="Filter results">
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              className="search-tab"
              aria-pressed={tab === g.key}
              onClick={() => setTab(g.key)}
            >
              {g.label}
              <span className="search-tab__count">{g.count}</span>
            </button>
          ))}
        </div>
      </div>

      <ResultSection
        id="categoryResults"
        eyebrow="Browse"
        heading="Categories"
        body={`${plural(hits.categories.length, 'category', 'categories')} matching “${query}”. Open one to see its products.`}
        show={showGroup('categories', hits.categories.length)}
      >
        {hits.categories.map((c) => (
          <CategoryCard
            key={c.name}
            name={c.name}
            description={c.shortDescription}
            imageUrl={c.image}
            href={categoryHref(c)}
            terms={terms}
          />
        ))}
      </ResultSection>

      <ResultSection
        id="productResults"
        alt
        eyebrow="Our capabilities"
        heading="Products"
        body={`${plural(hits.products.length, 'product')} matching “${query}” by name, category or description. Select one for details.`}
        show={showGroup('products', hits.products.length)}
      >
        {hits.products.map((p) => (
          <CategoryCard
            key={p.name}
            name={p.name}
            description={p.shortDescription}
            imageUrl={p.image}
            href={productHref(p)}
            terms={terms}
            onClick={() => openProduct(overlayDataFromSearch(p))}
          />
        ))}
      </ResultSection>

      <ResultSection
        id="blogResults"
        eyebrow="From the blog"
        heading="Articles"
        body={`${plural(hits.posts.length, 'article')} matching “${query}”.`}
        show={showGroup('blog', hits.posts.length)}
      >
        {hits.posts.map((p) => (
          <CategoryCard
            key={p.slug}
            name={p.title}
            description={p.excerpt}
            imageUrl={p.image}
            href={postHref(p)}
            terms={terms}
          />
        ))}
      </ResultSection>

      <section className="search-empty" id="searchEmpty" hidden={!empty}>
        <div className="search-empty__inner">
          <span className="search-empty__icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
              <line x1="13.6" y1="13.6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <h2 className="search-empty__title">{empty ? emptyTitle : ''}</h2>
          <p className="search-empty__body">{empty ? emptyBody : ''}</p>
          <div className="search-chips">
            {empty &&
              popular.map((n) => (
                <Link key={n} className="search-chip" to={resultsHref(n)}>
                  {n}
                </Link>
              ))}
          </div>
          <div className="search-empty__actions">
            <Link to="/catalogue" className="btn btn--primary">
              Browse the full catalogue
            </Link>
            <Link to="/search" className="search-empty__clear" id="searchClear" hidden={!(empty && terms.length)}>
              Clear search
            </Link>
          </div>
        </div>
      </section>

      </main>


      <Footer />
    </>
  );
}
