// Inner pages: styles.css (which imported the two card sheets) -> footer.css -> motion.css.
// Imported as strings (Vite `?inline`) so usePage can mount the page's own stack in the original
// cascade order and remove it again on the way out — the home page's stack defines some of the
// same selectors differently.
import categoryCard from './category-card.css?inline';
import trendCard from './trend-card.css?inline';
import footer from './footer.css?inline';
import motion from './motion.css?inline';
import site from './site.css?inline';
import overlay from './overlay.css?inline';

export const SITE_CSS = [categoryCard, trendCard, site, overlay, footer, motion].join('\n');
