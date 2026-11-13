import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePage from '../hooks/usePage';
import useReveal from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { SITE_CSS } from '../styles/site';
import { sanityFetch, urlForImageRef } from '../lib/sanity';
import { useProductOverlay } from '../context/ProductOverlay';

// Products page for one subcategory of one grade: /products-coconut?category=<slug>&grade=<organic|conventional>
// (defaults to organic Coconut Products). Products come from Sanity; clicking one opens its detail overlay.

const TRENDING = [
  {
    productName: 'Coconut Milk',
    productCategory: 'Coconut',
    productImage: '/assets/images/product-card.webp',
    productBotanical: 'Cocos nucifera',
    productSourced: 'Ooty & Munnar (India)',
    productDesc:
      "Organic coconut milk is extracted from fresh, grated coconut flesh and gently pressed to retain its natural richness. It's a nutritious, dairy-free staple widely used in curries, desserts and beverages. We source our premium coconut milk from several origins across South and Southeast Asia, supplying it fresh, UHT-packed or as concentrate.",
    alt: 'Coconut milk',
  },
  {
    productName: 'Coconut Cream',
    productCategory: 'Coconut',
    productImage: '/assets/images/trending-frame57.webp',
    productBotanical: 'Cocos nucifera',
    productSourced: 'Ooty & Munnar (India)',
    productDesc:
      'Organic coconut cream is a tropical staple rich in natural fats. This sweet treat is both nutritious and delicious. Our organic coconut cream is an important ingredient in curries, desserts and smoothies. We source our premium quality organic coconut cream from several origins in South Asia and Southeast Asia, supplying it as puree, paste or frozen slices (IQF).',
    alt: 'Coconut cream',
  },
  {
    productName: 'Desiccated Coconut',
    productCategory: 'Coconut',
    productImage: '/assets/images/trending-frame57.webp',
    productBotanical: 'Cocos nucifera',
    productSourced: 'Ooty & Munnar (India)',
    productDesc:
      "Desiccated coconut is made by drying and finely shredding fresh coconut meat, preserving its natural flavour and oils. It's a versatile ingredient for baking, confectionery and savoury dishes. We supply it in fine, medium and coarse grades, cleaned, graded and tested for purity before every shipment.",
    alt: 'Desiccated coconut',
  },
  {
    productName: 'Extra Virgin Coconut Oil',
    productCategory: 'Coconut',
    productImage: '/assets/images/trending-frame57.webp',
    productBotanical: 'Cocos nucifera',
    productSourced: 'Ooty & Munnar (India)',
    productDesc:
      'Extra virgin coconut oil is cold-pressed from fresh coconut meat without heat or chemicals, preserving its natural aroma and nutrients. Prized for cooking, skincare and haircare, we supply it in bulk, retail-ready and private-label packaging, tested for purity before every shipment.',
    alt: 'Extra virgin coconut oil',
  },
];

const stripTags = (s) =>
  String(s || '')
    .replace(/\s+/g, ' ')
    .trim();
// Same text as the product detail; the card CSS (.product-row__info p) truncates it after 2 lines.
const teaser = (p) => stripTags(p.description || p.shortDescription);

function ProductRow({ product: p, categoryTitle, grade, slug, onOpen }) {
  const img = urlForImageRef(p.imageRef) || '/assets/images/product-card.webp';
  const open = (e) => {
    e.preventDefault();
    onOpen({
      productName: p.name,
      productCategory: categoryTitle,
      productGrade: grade,
      productCategorySlug: slug,
      productImage: img,
      productBotanical: p.botanicalName,
      productSourced: p.sourcedFrom,
      productDesc: p.description || p.shortDescription,
      productPackaging: p.packaging,
      productGrades: p.gradeDetails,
      productChart: p.sizeChart || [],
      productShelf: p.shelfLife,
      productStorage: p.storage,
      productCerts: [...(p.certifications || []), ...(p.otherCertifications || [])].filter(Boolean).join(', '),
      productExtra: p.extraSpecs || [],
    });
  };
  // the whole product row is the click target (the "View Details" button included)
  return (
    <article className="product-row reveal is-visible" onClick={open}>
      <h2 className="product-row__title">{p.name}</h2>
      <div className="product-row__body">
        <div className="product-row__image">
          <img loading="lazy" decoding="async" src={img} alt={p.name || ''} />
        </div>
        <div className="product-row__info">
          <p>{teaser(p)}</p>
          <a href="#" className="btn btn--ghost view-products">
            View Details <img src="/assets/icons/arrow-right.svg" alt="" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ProductsCoconut() {
  const [params] = useSearchParams();
  const slug = params.get('category') || 'coconut-products';
  const grade = params.get('grade') === 'conventional' ? 'conventional' : 'organic';
  const gradeLabel = grade === 'organic' ? 'Organic Ingredients' : 'Conventional Ingredients';
  const { openProduct } = useProductOverlay();

  // status: 'loading' | 'ready' | 'error'
  const [state, setState] = useState({ status: 'loading', category: null, products: [] });

  useEffect(() => {
    let alive = true;
    Promise.all([
      sanityFetch(`*[_type=="category" && slug.current==$slug][0]{name, shortDescription}`, { slug }),
      sanityFetch(
        `*[_type=="product" && grade==$grade && (parentCategory->slug.current==$slug || $slug in additionalCategories[]->slug.current)] | order(order asc, name asc){name, category, shortDescription, description, botanicalName, sourcedFrom, packaging, gradeDetails, sizeChart, shelfLife, storage, certifications, otherCertifications, extraSpecs[]{label, value}, "imageRef": image.asset._ref}`,
        { slug, grade }
      ),
    ])
      .then(([category, products]) => alive && setState({ status: 'ready', category, products: products || [] }))
      .catch((err) => {
        console.error('Could not load products from Sanity', err);
        if (alive) setState({ status: 'error', category: null, products: [] });
      });
    return () => {
      alive = false;
    };
  }, [slug, grade]);

  const ready = state.status === 'ready';
  const title = (state.category && state.category.name) || 'Products';
  const count = state.products.length;

  usePage({
    title: ready ? `${title} | ${gradeLabel} | Truleaf` : 'Organic Coconut Products | Truleaf',
    description: 'Organic coconut products sourced from certified Indian farms, supplied in export-grade volumes.',
    path: '/products-coconut',
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  return (
    <>
      <header className="hero">
        <Nav />

        <div className="hero__content">
          {/* every step but the current page is a link; the grade goes to its section on the catalogue */}
          <nav className="hero__eyebrow" id="plpEyebrow" aria-label="Breadcrumb">
            <Link className="crumb-home" to="/">
              HOME
            </Link>
            <span className="crumb-sep crumb-home" aria-hidden="true">
              /
            </span>
            <Link to="/catalogue">PRODUCTS</Link>
            {ready && (
              <>
                <span className="crumb-sep" aria-hidden="true">
                  /
                </span>
                <Link to={`/catalogue#${grade}`}>{gradeLabel.toUpperCase()}</Link>
                <span className="crumb-sep" aria-hidden="true">
                  /
                </span>
                <span aria-current="page">{title.toUpperCase()}</span>
              </>
            )}
          </nav>
          <h1 className="hero__title" id="plpTitle">
            {title}
          </h1>

          <div className="hero__body">
            <p className="hero__stats" id="plpStats">
              {ready ? `${count} product${count === 1 ? '' : 's'}\u00A0·\u00A0${gradeLabel}` : ''}
            </p>
            <p className="hero__story" id="plpStory">
              {(state.category && state.category.shortDescription) || ''}
            </p>
          </div>
        </div>
      </header>

      <main id="main">

      <div className="split-hero reveal">
        <img src="/assets/images/hero-split.webp" alt="" />
      </div>

      <section className="product-grid" aria-label="Products">
        <div className="content-wrap" id="productList">
          {state.status === 'error' && (
            <p className="product-row__info">We could not load products right now. Please try again shortly.</p>
          )}
          {ready && !count && <p className="product-row__info">Products for this category are coming soon.</p>}
          {ready &&
            state.products.map((p) => (
              <ProductRow
                key={p.name}
                product={p}
                categoryTitle={title}
                grade={grade}
                slug={slug}
                onOpen={openProduct}
              />
            ))}
        </div>
      </section>

      <section className="cta-band reveal">
        <div className="content-wrap content-wrap--row">
          <div className="cta-band__text">
            <h2>Can't find what you need?</h2>
            <p>Talk to our sourcing team about custom specs, volumes and private-label packaging.</p>
          </div>
          <Link to="/contact" className="btn btn--primary">
            Enquire Now
          </Link>
        </div>
      </section>

      <section className="trending">
        <div className="content-wrap">
          <div className="trending__header reveal">
            <div>
              <p className="trending__eyebrow">Our capabilities</p>
              <h2 className="trending__title">Our Trending Products</h2>
            </div>
            <Link to="/catalogue" className="btn btn--primary">
              View Catalogue
            </Link>
          </div>

          <div className="trending__grid reveal-stagger">
            {TRENDING.map((item) => (
              <article
                key={item.productName}
                className="trend-card"
                onClick={(e) => {
                  e.preventDefault();
                  openProduct(item);
                }}
              >
                <div className="trend-card__image">
                  <img loading="lazy" decoding="async" src={item.productImage} alt={item.alt} />
                </div>
                <div className="trend-card__body">
                  <div className="trend-card__text">
                    <span className="trend-card__eyebrow">{item.productCategory}</span>
                    <h3>{item.productName}</h3>
                  </div>
                  <img src="/assets/icons/arrow-diagonal.svg" alt="" className="trend-card__icon" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      </main>


      <Footer />
    </>
  );
}
