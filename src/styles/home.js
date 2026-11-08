// Home page: card sheets -> footer.css -> design tokens -> page styles -> motion.css (see site.js for why strings).
import categoryCard from './category-card.css?inline';
import trendCard from './trend-card.css?inline';
import footer from './footer.css?inline';
import motion from './motion.css?inline';
import homeTokens from './home-tokens.css?inline';
import home from './home.css?inline';

export const HOME_CSS = [categoryCard, trendCard, footer, homeTokens, home, motion].join('\n');
