import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import TrendCard from '../components/TrendCard';
import usePage from '../hooks/usePage';
import useMotion from '../hooks/useMotion';
import {
  prefersReducedMotion,
  useHeroCarousel,
  useHeroEntrance,
  useHomeReveals,
  useHomeScenes,
  useSanityRowReveals,
  useStickyCta,
} from '../hooks/useHomeAnimations';
import { PRODUCT_LISTING_URL, sanityFetch, urlForImageRef } from '../lib/sanity';
import { HOME_CSS } from '../styles/home';
import { useProductOverlay } from '../context/ProductOverlay';
import { SEO } from '../lib/seoPages';

const TITLE = 'Truleaf | Organic Fruit, Vegetable & Ingredient Exporter from India';
const DESCRIPTION =
  'Traceable, certified organic fruits, vegetables and bulk ingredients, sourced direct from Indian farmer groups and shipped worldwide. Request a quote or sample.';

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://truleaf.in/#org',
      name: 'Truleaf',
      url: 'https://truleaf.in/',
      logo: 'https://truleaf.in/assets/icons/logo.svg',
      description:
        'Exporter of traceable, certified organic fresh and processed fruits, vegetables and ingredients from India.',
      email: 'info@truleaf.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1A-1B Neem Square, KRG Nagar Main Street, Ganapathy',
        addressLocality: 'Coimbatore',
        addressRegion: 'Tamil Nadu',
        postalCode: '641006',
        addressCountry: 'IN',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://truleaf.in/#site',
      url: 'https://truleaf.in/',
      name: 'Truleaf',
      publisher: { '@id': 'https://truleaf.in/#org' },
    },
  ],
};

const SLIDES = [
  { src: '/webimg/rice.webp', thumb: '/webimg/rice_t.webp', alt: 'Rice harvest close-up' },
  { src: '/webimg/oranges.webp', thumb: '/webimg/oranges_t.webp', alt: 'Ripe oranges hanging on a tree in an orchard' },
  { src: '/webimg/coconuts.webp', thumb: '/webimg/coconuts_t.webp', alt: 'A cluster of fresh green coconuts on the tree' },
];

// The mission headline is split into words so the scroll can fill them in one by one.
function MissionTitle({ split }) {
  const lines = ['Sourcing you can trace, standards', 'you can check.'];
  return (
    <h2 className="mission-title" id="missionText">
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'contents' }}>
          {li > 0 && (
            <>
              {' '}
              <br className="mission-title__br" />
            </>
          )}
          {split
            ? line.split(' ').map((w, wi) => (
                <span key={wi}>
                  {wi > 0 && ' '}
                  <span className="word">{w}</span>
                </span>
              ))
            : line}
        </span>
      ))}
    </h2>
  );
}

export default function Home() {
  usePage({ title: SEO['/'].title, description: SEO['/'].description, path: '/', css: HOME_CSS });
  const { openProduct } = useProductOverlay();

  /* featured categories + trending products: both lists come from Sanity (admin controls them in the Studio);
     each shows at most 4, lowest display order first */
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [rowsReady, setRowsReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const loadCategories = sanityFetch(
      `*[_type=="category" && featured==true] | order(order asc)[0...4]{name, shortDescription, "imageRef": image.asset._ref}`
    )
      .then((cats) => alive && setCategories(cats || []))
      .catch((err) => console.error('Could not load categories from Sanity', err));
    const loadProducts = sanityFetch(
      `*[_type=="product" && featured==true] | order(order asc)[0...4]{name, category, grade, "categorySlug": parentCategory->slug.current, shortDescription, description, botanicalName, sourcedFrom, packaging, gradeDetails, sizeChart, shelfLife, storage, certifications, "imageRef": image.asset._ref}`
    )
      .then((items) => alive && setProducts(items || []))
      .catch((err) => console.error('Could not load products from Sanity', err));
    Promise.all([loadCategories, loadProducts]).then(() => alive && setRowsReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const [splitWords] = useState(() => !prefersReducedMotion());
  const carousel = useHeroCarousel(SLIDES.length);
  const stickyOn = useStickyCta('hero');

  // order matters: base reveals, then the shared parallax layer, then the scroll scenes on top
  useHeroEntrance();
  useHomeReveals();
  useMotion();
  useHomeScenes();
  useSanityRowReveals(rowsReady);

  return (
    <>
      <main id="main">
      <section className="hero" id="hero">
        {SLIDES.slice(0, 2).map((s, i) => (
          <div key={s.src} className={carousel.slideClass(i)} ref={carousel.slideRef(i)}>
            <img src={s.src} alt={s.alt} />
            <div className="hero-scrim"></div>
          </div>
        ))}

        <div className="hero-nav-slot">
          <Nav />
        </div>
        {/* the third slide sits after the nav slot in the original markup; kept in place for identical stacking */}
        <div className={carousel.slideClass(2)} ref={carousel.slideRef(2)}>
          <img src={SLIDES[2].src} alt={SLIDES[2].alt} />
          <div className="hero-scrim"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title t-display" id="heroTitle">
            <span className="line">
              <span>Reliable organic sourcing</span>
            </span>
            <span className="line">
              <span>for global markets</span>
            </span>
          </h1>
          <p className="hero-sub">
            We export traceable, certified organic fresh and processed fruits and vegetables, and organic ingredients,
            sourced directly from origin to international buyers, with a strong focus on quality, food safety,
            compliance, documentation, and seamless logistics.
          </p>
          <div className="hero-actions">
            <Link to="/contact?enquiry=quote" className="btn btn-brand">
              Request a quote
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </Link>
            <Link to="/catalogue" className="btn btn-glass">
              Browse catalogue
            </Link>
          </div>
        </div>

        <div className="hero-scroll t-label">
          <span>Scroll</span>
          <span className="mouse"></span>
        </div>
        <div className="hero-thumbs" id="heroThumbs" onMouseEnter={carousel.pause} onMouseLeave={carousel.restart}>
          {SLIDES.map((s, i) => (
            <div key={s.thumb} className={carousel.thumbClass(i)} onClick={() => carousel.goTo(i)}>
              <img loading="lazy" decoding="async" src={s.thumb} alt="" />
            </div>
          ))}
        </div>
      </section>


      <section className="certs">
        <div className="certs-inner">
          <p className="certs-statement">
            Everything we export is trusted at the processing source, certified to global markets and compliant
            worldwide.
          </p>
          <div className="certs-row">
            <div className="cert-badge">
              <img className="cert-badge-logo" src="/assets/icons/cert-usda-organic.svg" alt="USDA Organic seal" />
              <span>Organic</span>
            </div>
            <div className="cert-badge">
              <img
                className="cert-badge-logo cert-badge-logo--compact"
                src="/assets/icons/cert-brcgs-agents-brokers.svg"
                alt="BRCGS Agents and Brokers Certificated"
              />
              <span>Agents &amp; Brokers</span>
            </div>
            <div className="cert-badge">
              <img
                className="cert-badge-logo cert-badge-logo--wide"
                src="/assets/icons/cert-sedex-member.svg"
                alt="Sedex Member"
              />
              <span>Member</span>
            </div>
            <div className="cert-badge">
              <img className="cert-badge-logo" src="/assets/icons/cert-india-organic.svg" alt="India Organic logo" />
              <span>NPOP</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sourcing">
        <div className="sourcing-inner">
          <div className="sourcing-head">
            <h2 className="sourcing-title">
              Rooted in Indian Soil,
              <br />
              Grown for the
              <br />
              <em>Global Stage.</em>
            </h2>
            <div className="sourcing-aside">
              <p>
                We work with certified organic farmer producer groups and trusted processors to source premium-quality
                products for global markets.
              </p>
              <div className="sourcing-stats">
                <div className="s-stat">
                  <b className="counter" data-target="100" data-suffix="+">
                    100+
                  </b>
                  <span>Farm clusters</span>
                </div>
                <div className="s-stat">
                  <b className="counter" data-target="24" data-suffix="+">
                    24+
                  </b>
                  <span>Products</span>
                </div>
              </div>
            </div>
          </div>
          <div className="sourcing-figure" id="sourcingFigure">
            <div className="sourcing-figure-media">
              <img
                loading="lazy"
                decoding="async"
                src="/assets/images/sourcing-greens.webp"
                alt="Fresh Brussels sprouts and broccoli"
              />
            </div>
            <div className="sourcing-card">
              <svg className="sourcing-card-icon" viewBox="0 0 64.0004 53.3654" aria-hidden="true">
                <use href="#cap-icon-shape" />
              </svg>
              <h3>Direct from the Source</h3>
              <p>
                Partnering with certified organic farmers and trusted processors to deliver traceable, premium-quality
                products to global markets. Browse the full range in our catalogue.
              </p>
              <Link to="/catalogue" className="btn btn-glass sourcing-card-cta">
                Explore our catalogue{' '}
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mission">
        <div className="mission-inner">
          <MissionTitle split={splitWords} />
          <p className="mission-lede" id="missionLede">
            Every lot we export is traced to its farm cluster and backed by organic certification and export documents,
            so your buyers and auditors can check it.
          </p>
          <Link to="/about" className="btn btn-outline mission-cta">
            See our impact{' '}
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
        <div className="mission-cards" id="missionCards">
          <div className="mission-card mission-card--stat">
            <h3 className="mission-card-title">Traceable by design</h3>
            <div className="mission-card-foot">
              <b className="m-stat-num counter" data-target="100" data-suffix="+">
                100+
              </b>
              <p>Farm clusters in our organic producer network, each traceable from farm to port</p>
            </div>
          </div>
          <div className="mission-card mission-card--photo">
            <img
              loading="lazy"
              decoding="async"
              src="/webimg/figma-sustain.webp"
              alt="Sunlit farmland conserved for future harvests"
            />
            <div className="mission-card-body">
              <h3 className="mission-card-title">Fair to farmers</h3>
              <p>Organic and fair-trade partnerships that protect farmer livelihoods and long-term soil health</p>
            </div>
          </div>
          <div className="mission-card mission-card--teal">
            <div className="mission-teal-top">
              <span>Certified. Compliant. Documented.</span>
              <span className="mission-pill">
                <img loading="lazy" decoding="async" src="/assets/icons/mission-leaf.svg" alt="" />
              </span>
            </div>
            <h3 className="mission-card-title">Ready for your market's audits</h3>
            <div className="mission-teal-foot">
              <span className="mission-badge">
                <img loading="lazy" decoding="async" src="/assets/icons/mission-globe.svg" alt="" />
              </span>
              <span>USDA Organic, EU Organic and ISO 22000:2018 certified</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trending" id="trending">
        <div className="trending-inner">
          <div className="cat-list-wrap">
            <div className="cat-list-aside">
              <div className="cat-list-head">
                <div className="cat-list-titles">
                  <span className="cat-list-eyebrow">Categories</span>
                  <h2 className="section-head-title" id="trendingTitle">
                    Featured Categories
                  </h2>
                </div>
                <p>
                  Explore our range of responsibly sourced food products, ingredients, and value-added solutions for
                  global markets.
                </p>
              </div>
              <Link to="/catalogue" className="btn btn-brand">
                View Catalogue
              </Link>
            </div>
            <div className="cat-list" id="trendingRow">
              {categories.map((c) => (
                <CategoryCard
                  key={c.name}
                  name={c.name}
                  description={c.shortDescription}
                  imageUrl={urlForImageRef(c.imageRef)}
                  href={PRODUCT_LISTING_URL}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="capabilities" id="capabilities">
        <div className="capabilities-inner">
          <div className="section-head section-head--narrow">
            <span className="section-eyebrow">Why Truleaf</span>
            <h2 className="section-head-title" id="capabilitiesTitle">
              Bulk organic ingredients, supplied through reliable global sourcing.
            </h2>
          </div>
          <div className="cap-row" id="capRow">
            <div className="cap-figure">
              <img
                loading="lazy"
                decoding="async"
                src="/webimg/harvest.webp"
                alt="Hands passing a wooden crate of freshly harvested aubergines in the field"
              />
              <div className="cap-stat">
                <span className="cap-stat-num">24+</span>
                <span className="cap-stat-label">Products Sourced</span>
              </div>
            </div>
            <div className="cap-cards">
              <div className="cap-col">
                <div className="cap-card">
                  <img loading="lazy" decoding="async" className="cap-icon" src="/assets/icons/cap-bulk.svg" alt="" />
                  <h3>Bulk Ingredients</h3>
                  <p>
                    Consistent, export-grade volumes prepared to exact spec — from single-origin lots to blended supply
                    programs.
                  </p>
                </div>
                <div className="cap-card">
                  <img loading="lazy" decoding="async" className="cap-icon" src="/assets/icons/handle-rd.svg" alt="" />
                  <h3>R&amp;D Collaboration</h3>
                  <p>
                    Our in-house food scientists work alongside your team on custom formulations, extracts and blends.
                  </p>
                </div>
              </div>
              <div className="cap-col">
                <div className="cap-card">
                  <img
                    loading="lazy"
                    decoding="async"
                    className="cap-icon"
                    src="/assets/icons/cap-support.svg"
                    alt=""
                  />
                  <h3>Customer Support</h3>
                  <p>
                    Dedicated account teams manage documentation, logistics and compliance from PO through delivery.
                  </p>
                </div>
                <div className="cap-card">
                  <img
                    loading="lazy"
                    decoding="async"
                    className="cap-icon"
                    src="/assets/icons/cap-responsibility.svg"
                    alt=""
                  />
                  <h3>Responsibility</h3>
                  <p>
                    Certified organic and fair-trade partnerships that protect farmer livelihoods and long-term soil
                    health.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="products" id="products">
        <div className="products-inner">
          <div className="products-head">
            <div className="products-titles">
              <span className="section-eyebrow">Trending now</span>
              <h2 className="section-head-title" id="productsTitle">
                Our Trending Products
              </h2>
            </div>
            <Link to="/catalogue" className="btn btn-brand">
              View Catalogue
            </Link>
          </div>
          <div className="products-row" id="productsRow">
            {products.map((p) => (
              <TrendCard
                key={p.name}
                name={p.name}
                category={p.category}
                imageUrl={urlForImageRef(p.imageRef)}
                href="/catalogue"
                onClick={() =>
                  openProduct({
                    productName: p.name,
                    productCategory: p.category,
                    productGrade: p.grade,
                    productCategorySlug: p.categorySlug,
                    productImage: urlForImageRef(p.imageRef),
                    productBotanical: p.botanicalName,
                    productSourced: p.sourcedFrom,
                    productDesc: p.description || p.shortDescription,
                    productPackaging: p.packaging,
                    productGrades: p.gradeDetails,
                    productChart: p.sizeChart || [],
                    productShelf: p.shelfLife,
                    productStorage: p.storage,
                    productCerts: (p.certifications || []).join(', '),
                  })
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="buying">
        <div className="buying-inner">
          <div className="buying-head">
            <span className="section-eyebrow">How buying works</span>
            <h2 className="section-head-title">From first enquiry to your port, in four steps.</h2>
          </div>
          <ol className="buying-steps">
            <li>
              <span className="buying-count">01</span>
              <span className="buying-icon" aria-hidden="true">
                <img src="/assets/icons/handle-enquire.svg" alt="" />
              </span>
              <h3>Enquire</h3>
              <p>Tell us the product, volume and destination. We reply with availability and pricing.</p>
            </li>
            <li>
              <span className="buying-count">02</span>
              <span className="buying-icon" aria-hidden="true">
                <img src="/assets/icons/handle-rd.svg" alt="" />
              </span>
              <h3>Sample and specs</h3>
              <p>Review samples and exact specifications, or work with our food scientists on a custom blend.</p>
            </li>
            <li>
              <span className="buying-count">03</span>
              <span className="buying-icon" aria-hidden="true">
                <img src="/assets/icons/handle-certification.svg" alt="" />
              </span>
              <h3>Documentation</h3>
              <p>We prepare certificates, compliance papers and export documents for your market.</p>
            </li>
            <li>
              <span className="buying-count">04</span>
              <span className="buying-icon" aria-hidden="true">
                <img src="/assets/icons/handle-logistics.svg" alt="" />
              </span>
              <h3>Shipment</h3>
              <p>Logistics handled end to end, with your account team in touch until delivery.</p>
            </li>
          </ol>
          <div className="buying-actions">
            <Link to="/contact?enquiry=quote" className="btn btn-outline">
              Start an enquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="impact">
        <div className="impact-inner">
          <div className="impact-figure" id="impactFigure">
            <img loading="lazy" decoding="async" src="/webimg/figma-impact.webp" alt="Rows of crops under an open sky" />
            <div className="impact-row">
              <div className="impact-cta">
                <h3>Ready to source organic, with confidence?</h3>
                <p className="impact-cta-sub">
                  Tell us what you need. Our team will come back with availability, specs and a quote.
                </p>
                <div className="impact-cta-actions">
                  <Link to="/contact?enquiry=quote" className="btn btn-primary-img">
                    Request a quote{' '}
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </Link>
                  <Link to="/catalogue" className="btn btn-glass">
                    Download catalogue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="retail" id="retail">
        <div className="retail-inner">
          <div className="retail-copy">
            <span className="section-eyebrow">Ready to Retail</span>
            <h2 className="section-head-title">Got a product idea? We&apos;ll make it retail-ready.</h2>
            <p>
              From bulk ingredient to shelf-ready pack: sourcing, formulation, compliance and private-label production,
              under one roof.
            </p>
          </div>
          <ul className="retail-points">
            <li>
              <h3>R&amp;D &amp; formulation</h3>
              <p>Develop your recipe with our food scientists, or work from your own specification.</p>
            </li>
            <li>
              <h3>Packaging &amp; labels</h3>
              <p>Retail-ready pack design and label compliance for your target market.</p>
            </li>
            <li>
              <h3>Safety &amp; compliance</h3>
              <p>Third-party audits and accredited lab testing at every stage.</p>
            </li>
            <li>
              <h3>Private-label production</h3>
              <p>Traceable supply from origin to delivery, with account support after launch.</p>
            </li>
          </ul>
          <div className="retail-actions">
            <Link to="/ready-to-retail" className="btn btn-brand">
              Explore private label{' '}
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Link to="/contact?enquiry=quote" className={`sticky-cta${stickyOn ? ' is-on' : ''}`} id="stickyCta">
              Request a quote
            </Link>
      </main>


      <Footer />

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <path
            id="cap-icon-shape"
            d="M62.0675 28.1025C61.92 27.9175 61.9 27.6725 62.0175 27.475C62.165 27.225 62.2925 26.975 62.42 26.7125C63.63 24.19 63.8525 21.875 63.0975 19.8325C62.1 17.145 59.6801 15.685 58.2275 15.02C59.4575 10.8401 57.42 6.35507 53.4475 4.52531C49.525 2.70784 44.7697 4.06528 42.3825 7.68032C42.3625 7.70528 42.325 7.7303 42.2875 7.71283C40.815 7.10528 37.1475 5.94534 34.0622 7.86029C33.0197 7.59782 32.0397 7.5328 31.3097 7.5328C30.6697 3.22528 26.9447 0 22.575 0C18.1775 0 14.5052 3.15501 13.8447 7.50016C13.8372 7.53267 13.8198 7.57018 13.7747 7.57018C12.1097 7.64019 9.01971 8.09517 6.98496 10.3476C5.61501 11.8701 4.99498 13.9126 5.1425 16.4351C5.15 16.5251 5.15 16.6201 5.155 16.7101C5.1625 16.8901 5.16749 17.0676 5.18749 17.2676C5.21249 17.4926 5.10499 17.6976 4.92499 17.7851C1.8825 19.2901 0 22.3252 0 25.7026C0 29.4651 2.38752 32.8251 5.93997 34.0603C8.63494 34.9953 10.79 36.5553 12.18 38.5653C14.0625 41.2853 15.0925 44.1729 15.245 47.1555C15.27 47.6729 15.335 48.3579 15.59 49.0254C16.4675 51.3354 18.2775 52.3155 20.965 51.938C22.0275 51.7905 23.1025 51.7905 24.1575 51.938C24.535 51.988 24.8925 52.0154 25.2325 52.0154C26.775 52.0154 27.96 51.4705 28.785 50.4029C29.2075 50.6454 29.6876 50.8505 30.2625 51.023C31.28 51.3229 32.2525 51.773 33.1625 52.3604C34.2125 53.033 35.21 53.3654 36.1575 53.3654C37.27 53.3654 38.315 52.8979 39.2625 51.9629C39.755 51.4755 40.0876 50.908 40.3575 50.4129C41.7475 47.7704 43.89 45.5754 46.7375 43.8907C48.8375 42.6432 51.4476 42.1382 54.2953 42.4132C58.0403 42.7707 61.6105 40.7232 63.1779 37.3057C64.5901 34.2682 64.1606 30.7405 62.0678 28.1031L62.0675 28.1025ZM24.4099 50.1652C24.0899 50.1202 23.7774 50.0877 23.4574 50.0702V46.6452C23.8274 41.1802 28.2574 39.9828 28.4499 39.9329C28.9224 39.8104 29.2174 39.3304 29.0974 38.8579C28.9824 38.3779 28.4949 38.0904 28.0149 38.2054C27.9774 38.2179 25.3274 38.9104 23.4574 41.4379V36.0754C24.1549 28.6053 32.635 26.9631 32.9921 26.8901C33.4796 26.8001 33.7996 26.3401 33.7096 25.8526C33.6196 25.3651 33.1596 25.0451 32.6721 25.1351C32.5696 25.1551 30.1046 25.6151 27.5196 27.1451C25.7971 28.1701 24.4296 29.4301 23.4496 30.8826V21.8752C24.4921 18.9827 29.0871 18.7527 29.1446 18.7527C29.6371 18.7327 30.0146 18.3177 29.9946 17.8252C29.9745 17.3327 29.5645 16.9552 29.0671 16.9677C28.887 16.9752 25.6421 17.1277 23.442 18.9327V11.1254C23.442 10.6329 23.0445 10.2354 22.5521 10.2354C22.0596 10.2354 21.6621 10.6329 21.6621 11.1254V13.9554C19.4596 12.1504 16.2221 11.9979 16.0371 11.9904C15.5445 11.9704 15.127 12.3554 15.1096 12.8479C15.0895 13.3404 15.4746 13.7579 15.967 13.7754C16.012 13.7754 20.607 13.9928 21.662 16.8979V24.6553C20.6821 23.2028 19.312 21.9428 17.592 20.9178C15.012 19.3878 12.5495 18.9278 12.4395 18.9078C11.952 18.8179 11.492 19.1379 11.402 19.6253C11.312 20.1128 11.632 20.5729 12.1195 20.6628C12.477 20.7279 20.9643 22.3779 21.6542 29.8481V36.4657C20.6742 35.0132 19.3042 33.7532 17.5842 32.7283C15.0042 31.1983 12.5417 30.7382 12.4317 30.7183C11.9442 30.6283 11.4842 30.9483 11.3942 31.4358C11.3041 31.9233 11.6241 32.3833 12.1117 32.4733C12.4692 32.5383 20.9565 34.1883 21.6464 41.6586V50.0733C21.3264 50.0933 21.0064 50.1233 20.6939 50.1683C18.8389 50.4308 17.8014 49.8983 17.2314 48.3883C17.0639 47.9533 17.0214 47.4483 17.0013 47.0583C16.8289 43.7433 15.6963 40.5431 13.6214 37.5485C12.0139 35.226 9.55136 33.4335 6.49882 32.3711C3.6638 31.386 1.75628 28.7036 1.75628 25.6959C1.75628 23.0009 3.26131 20.5834 5.67878 19.3784C6.52378 18.9634 7.02381 18.0333 6.92128 17.0809C6.9088 16.9459 6.90125 16.806 6.89626 16.646C6.88877 16.5434 6.88877 16.4359 6.88378 16.3334C6.76128 14.3109 7.2288 12.6984 8.27379 11.5459C9.93126 9.70842 12.7038 9.4009 13.8163 9.3559C14.6988 9.3184 15.4363 8.65088 15.5688 7.76838C16.0988 4.29837 19.0314 1.78336 22.5391 1.78336C26.0716 1.78336 29.0792 4.42586 29.5343 7.93338C29.6368 8.72589 30.3093 9.3159 31.1093 9.3159H31.1418C32.1718 9.29587 34.7567 9.43091 36.4593 11.1259C37.6493 12.3109 38.2317 14.0709 38.1993 16.3684C38.1918 16.6509 38.1868 16.8733 38.1618 17.0784C38.0593 18.0459 38.5593 18.9609 39.4343 19.4009C41.8343 20.6109 43.3193 23.0234 43.3193 25.7059C43.3193 28.7134 41.4118 31.3959 38.5768 32.3811C37.3418 32.8111 36.2093 33.3611 35.1843 34.0136C35.1642 34.0261 35.1517 34.0336 35.1343 34.0461C33.6493 35.0061 32.4018 36.1911 31.4543 37.5586C29.3868 40.5536 28.2468 43.7536 28.0743 47.0683C28.0543 47.4584 28.0093 47.9634 27.8443 48.3984C27.3018 49.8959 26.2643 50.4284 24.4093 50.1658L24.4099 50.1652ZM37.5747 36.8276C37.5672 36.8351 37.5672 36.8476 37.5622 36.8526L37.3772 37.2501C37.2622 36.5401 37.0697 35.8301 36.8022 35.1201C37.4222 34.7751 38.0822 34.4676 38.7872 34.1976L37.6022 36.7776C37.5922 36.8001 37.5797 36.8126 37.5747 36.8276ZM29.6074 48.8129C29.7999 48.2104 29.8573 47.6154 29.8824 47.1478C30.0348 44.1653 31.0674 41.2778 32.9474 38.5578C33.5749 37.6477 34.3549 36.8353 35.2699 36.1327C35.9099 38.0778 35.8849 40.0378 35.1999 41.9827L33.1449 46.4428C33.1374 46.4503 33.1374 46.4628 33.1324 46.4678L31.6799 49.6178C31.3799 49.5028 31.0774 49.4003 30.7699 49.3103C30.3049 49.1653 29.9199 49.0054 29.6074 48.8129ZM61.5626 36.5581C60.3076 39.2856 57.4525 40.9231 54.465 40.6356C51.2399 40.3232 48.2575 40.9181 45.8326 42.3507C42.6977 44.2006 40.3276 46.6332 38.785 49.5705C38.5875 49.9405 38.3375 50.3705 38.0175 50.683C36.8725 51.8105 35.7075 51.8605 34.1275 50.8556C33.8575 50.683 33.5825 50.5155 33.3025 50.363L34.7425 47.2405C37.3675 42.448 41.8849 43.208 42.0775 43.2405C42.5575 43.3306 43.025 43.0156 43.115 42.5305C43.205 42.043 42.89 41.583 42.405 41.488C42.3675 41.4805 39.665 41.0005 36.915 42.518L39.155 37.6605C42.9125 31.1505 51.3073 33.2056 51.6677 33.303C52.1402 33.4255 52.6276 33.1356 52.7501 32.663C52.8726 32.1906 52.5827 31.703 52.1101 31.5756C52.0076 31.5506 49.5752 30.9356 46.5926 31.2431C44.6801 31.4406 42.9827 31.978 41.5226 32.8231C43.7427 31.1856 45.1251 28.5606 45.1251 25.7005C45.1251 25.4006 45.1051 25.1105 45.0751 24.818L45.1076 24.748C47.2701 22.5731 51.5325 24.2806 51.5773 24.3005C52.0324 24.4856 52.5498 24.2755 52.7423 23.8205C52.9274 23.3656 52.7174 22.8481 52.2623 22.6556C52.0948 22.5855 49.0874 21.3681 46.3349 22.0856L49.5999 14.9956C49.8049 14.5482 49.6124 14.0232 49.1649 13.8106C48.7174 13.6056 48.1924 13.7981 47.9798 14.2456L46.7948 16.8181C45.5523 14.2581 42.6723 12.7606 42.5073 12.6781C42.0723 12.4531 41.5349 12.6281 41.3098 13.068C41.0849 13.5106 41.2598 14.0405 41.6998 14.2655C41.7448 14.2856 45.8348 16.4106 45.5598 19.4956L44.3623 22.0931C43.5498 20.2681 42.1223 18.7405 40.2598 17.7981C40.0498 17.6881 39.9273 17.4856 39.9523 17.2531C39.9773 16.9981 39.9898 16.7231 39.9973 16.3881C40.0348 13.5906 39.2748 11.3906 37.7323 9.85306C37.2973 9.41805 36.8298 9.07302 36.3423 8.78304C38.4148 8.22054 40.6048 8.94304 41.5972 9.35302C42.4172 9.6855 43.3647 9.39053 43.8572 8.65555C45.7647 5.76806 49.5597 4.68806 52.6899 6.14054C55.9023 7.61805 57.5274 11.273 56.4648 14.6532C56.2273 15.4282 56.6048 16.2607 57.3473 16.5807C58.2949 16.9957 60.5848 18.2006 61.4173 20.4532C61.9998 22.0207 61.7948 23.8707 60.8098 25.9307C60.6949 26.1607 60.5848 26.3732 60.4773 26.5632C59.9773 27.3957 60.0549 28.4332 60.6623 29.2007C62.3423 31.3157 62.6876 34.1332 61.5626 36.5581Z"
          />
        </defs>
      </svg>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }} />
    </>
  );
}
