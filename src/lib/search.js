import { sanityFetch, PRODUCT_LISTING_URL } from './sanity';

// Site search: shared data loading + ranking. Products + posts are fetched
// once per session and reused by the type-ahead and the results page.
let dataPromise;

export function loadSearchData() {
  if (!dataPromise) {
    dataPromise = Promise.all([
      sanityFetch(
        `*[_type=="category"] | order(order asc){name, shortDescription, "image": image.asset->url, "thumb": image.asset->url + "?w=96&h=96&fit=crop&auto=format"}`
      ),
      sanityFetch(
        `*[_type=="product"] | order(order asc){name, category, grade, shortDescription, description, botanicalName, sourcedFrom, "image": image.asset->url, "overlayImage": image.asset->url + "?w=1200&auto=format", "thumb": image.asset->url + "?w=96&h=96&fit=crop&auto=format"}`
      ),
      sanityFetch(
        `*[_type=="post" && hidden != true] | order(date desc){title, excerpt, category, author, "slug": slug.current, "image": image.asset->url, "thumb": image.asset->url + "?w=96&h=96&fit=crop&auto=format"}`
      ),
    ]).then(([categories, products, posts]) => ({ categories, products, posts }));
    dataPromise.catch(() => {
      dataPromise = null;
    });
  }
  return dataPromise;
}

export const termsOf = (q) => (q || '').toLowerCase().split(/\s+/).filter(Boolean);

// every term has to appear somewhere in the item's text; name hits rank first
function rank(terms, nameText, otherText) {
  const name = (nameText || '').toLowerCase();
  const rest = `${name} ${(otherText || '').toLowerCase()}`;
  if (!terms.length || !terms.every((t) => rest.includes(t))) return -1;
  return terms.reduce((score, t) => score + (name.includes(t) ? 3 : 1), 0);
}

function search(items, nameOf, textOf, terms) {
  return items
    .map((item) => ({ item, score: rank(terms, nameOf(item), textOf(item)) }))
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}

const categoryText = (c) => c.shortDescription || '';
const productText = (p) =>
  [p.category, p.grade, p.shortDescription, p.description, p.botanicalName, p.sourcedFrom].join(' ');
const postText = (p) => [p.excerpt, p.category, p.author].join(' ');

export function findResults(data, terms) {
  return {
    categories: search(data.categories, (c) => c.name, categoryText, terms),
    products: search(data.products, (p) => p.name, productText, terms),
    posts: search(data.posts, (p) => p.title, postText, terms),
  };
}

// categories lead to the product listing page; products open the bottom overlay
export const categoryHref = () => PRODUCT_LISTING_URL;
export const productHref = () => PRODUCT_LISTING_URL;
export const postHref = (p) => `/blog-post?post=${p.slug}`;
export const resultsHref = (q) => `/search?q=${encodeURIComponent(q)}`;

// shape a search product into what the product overlay expects
export const overlayDataFromSearch = (p) => ({
  productName: p.name,
  productCategory: p.category,
  productImage: p.overlayImage || p.image,
  productDesc: p.description || p.shortDescription,
  productBotanical: p.botanicalName,
  productSourced: p.sourcedFrom,
});
