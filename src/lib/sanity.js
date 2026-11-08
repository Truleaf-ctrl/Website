// Shared Sanity read client. No token: it only reads published content,
// which is public by default on Sanity's CDN.
export const SANITY_PROJECT_ID = 'qir915mw';
export const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

export async function sanityFetch(query, params) {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
  );
  url.searchParams.set('query', query);
  if (params) {
    for (const key of Object.keys(params)) {
      url.searchParams.set(`$${key}`, JSON.stringify(params[key]));
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Sanity request failed: ${res.status}`);
  const data = await res.json();
  return data.result;
}

// Resolve a Sanity image asset reference (e.g. "image-abc123-2000x1500-png")
// into a CDN URL, without an extra network round trip.
export function urlForImageRef(ref) {
  if (!ref) return '';
  const parts = ref.replace('image-', '').split('-');
  const format = parts.pop();
  const dimensions = parts.pop();
  const id = parts.join('-');
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}`;
}

export function formatDate(isoDate) {
  if (!isoDate) return '';
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Product listing page that every category card opens (site-wide rule).
export const PRODUCT_LISTING_URL = '/products-coconut';
