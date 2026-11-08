import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import CategoryCard from '../components/CategoryCard';
import SearchBox from '../components/SearchBox';
import Footer from '../components/Footer';
import usePage from '../hooks/usePage';
import useReveal, { revealAllStagger } from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { SITE_CSS } from '../styles/site';
import { PRODUCT_LISTING_URL, sanityFetch, urlForImageRef } from '../lib/sanity';

// Grade (Organic / Conventional Ingredients) -> subcategories, all from Sanity: Category documents with
// "Show on Product Catalogue" ticked, ordered by their Organic / Conventional display order.
// Each card opens that subcategory's products page for the grade.
const listQuery = (flag, order) =>
  `*[_type=="category" && ${flag}==true] | order(${order} asc){name, shortDescription, "slug": slug.current, "imageRef": image.asset._ref}`;

// Shown only until the catalogue categories exist in Sanity (see studio/seed-catalogue.mjs).
const IMG = '/assets/images/category-normalized/';
const FALLBACK = {
  coconut: {
    name: 'Coconut Products',
    slug: 'coconut-products',
    shortDescription: 'Milk, cream, oils, desiccated and more, sourced from trusted processors.',
    image: IMG + 'category-coconut-products.png',
  },
  fruitsVeg: {
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    shortDescription: 'Fresh produce graded and packed for export.',
    image: IMG + 'category-fruits-vegetables.png',
  },
  oils: {
    name: 'Edible Oils',
    slug: 'edible-oils',
    shortDescription: 'Cold-pressed and refined oils in bulk and retail packs.',
    image: IMG + 'category-edible-oils.png',
  },
  juices: {
    name: 'Juices & Purees',
    slug: 'juices-purees',
    shortDescription: 'Fruit juices and purees for beverage and food makers.',
    image: IMG + 'category-juices-purees.png',
  },
  pickled: {
    name: 'Pickled & Preserved Vegetables',
    slug: 'pickled-preserved-vegetables',
    shortDescription: 'Pickled and preserved vegetables, ready for retail and food service.',
    image: IMG + 'category-pickled-vegetables.png',
  },
  frozen: {
    name: 'Frozen Fruits & Vegetables',
    slug: 'frozen-fruits-vegetables',
    shortDescription: 'Frozen fruits and vegetables with the cold chain intact.',
    image: IMG + 'category-frozen-produce.png',
  },
};
const FALLBACK_ORGANIC = ['coconut', 'fruitsVeg', 'oils', 'juices'].map((k) => FALLBACK[k]);
const FALLBACK_CONVENTIONAL = ['coconut', 'pickled', 'juices', 'fruitsVeg', 'oils', 'frozen'].map((k) => FALLBACK[k]);

async function loadList(query, fallback) {
  let items = [];
  try {
    items = await sanityFetch(query);
  } catch (err) {
    console.error('Could not load catalogue categories from Sanity', err);
  }
  return items && items.length ? items : fallback;
}

function CategoryList({ id, items, grade }) {
  return (
    <div className="catalogue-section__list reveal-stagger" id={id}>
      {(items || []).map((c) => (
        <CategoryCard
          key={c.slug}
          name={c.name}
          description={c.shortDescription || ''}
          imageUrl={c.image || urlForImageRef(c.imageRef)}
          href={`${PRODUCT_LISTING_URL}?category=${encodeURIComponent(c.slug)}&grade=${grade}`}
        />
      ))}
    </div>
  );
}

export default function Catalogue() {
  usePage({
    title: 'Product Catalogue | Truleaf',
    description:
      "Browse Truleaf's range of organic fresh and processed produce, ingredients and value-added products for global buyers.",
    path: '/catalogue',
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  const [lists, setLists] = useState({ organic: null, conventional: null });

  useEffect(() => {
    let alive = true;
    Promise.all([
      loadList(listQuery('showOrganic', 'organicOrder'), FALLBACK_ORGANIC),
      loadList(listQuery('showConventional', 'conventionalOrder'), FALLBACK_CONVENTIONAL),
    ]).then(([organic, conventional]) => {
      if (!alive) return;
      setLists({ organic, conventional });
      requestAnimationFrame(revealAllStagger);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <header className="catalogue-hero">
        <Nav />

        <div className="catalogue-hero__content reveal">
          <h1 className="catalogue-hero__title">Product Catalogue</h1>

          <SearchBox placeholder="Search for premium spices, nuts, or seeds..." ariaLabel="Search products" />
        </div>
      </header>

      <section className="catalogue-section" id="organic">
        <div className="content-wrap catalogue-section__grid">
          <div className="catalogue-section__intro">
            <p className="catalogue-eyebrow">Our capabilities</p>
            <h2 className="catalogue-section__heading">Organic Ingredients</h2>
            <p className="catalogue-section__body">
              Certified organic ingredients, sourced from farms with full traceability back to origin, tested and graded
              before every shipment.
            </p>
          </div>

          <CategoryList id="organicProductList" items={lists.organic} grade="organic" />
        </div>
      </section>

      <section className="catalogue-section catalogue-section--alt" id="conventional">
        <div className="content-wrap catalogue-section__grid">
          <div className="catalogue-section__intro">
            <p className="catalogue-eyebrow">Our capabilities</p>
            <h2 className="catalogue-section__heading">Conventional Ingredients</h2>
            <p className="catalogue-section__body">
              The same ingredient range at conventional grade, with flexible volumes and bulk or private-label
              packaging, for buyers who don't require organic certification.
            </p>
          </div>

          <CategoryList id="conventionalProductList" items={lists.conventional} grade="conventional" />
        </div>
      </section>

      <Footer />
    </>
  );
}
