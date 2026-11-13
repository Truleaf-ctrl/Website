import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { SEO, SITE } from './src/lib/seoPages.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// After the build, write a real HTML file for every page with its own <title>, description, canonical and
// social tags, plus a text fallback. Crawlers (and link previews) then see correct content without running JS.
// Apache serves /about from about.html (see public/.htaccess); the React app still takes over in the browser.
function seoShells() {
  return {
    name: 'truleaf-seo-shells',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist');
      const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
      const nav = Object.entries(SEO)
        .filter(([p]) => p !== '/')
        .map(([p, v]) => `<a href="${p}">${esc(v.title.split(' | ')[0])}</a>`)
        .join(' · ');
      for (const [route, meta] of Object.entries(SEO)) {
        const url = `${SITE}${route === '/' ? '/' : route}`;
        const head =
          `<title>${esc(meta.title)}</title>\n` +
          `<meta name="description" content="${esc(meta.description)}" />\n` +
          `<link rel="canonical" href="${url}" />\n` +
          `<meta property="og:type" content="website" />\n<meta property="og:site_name" content="Truleaf" />\n` +
          `<meta property="og:title" content="${esc(meta.title)}" />\n` +
          `<meta property="og:description" content="${esc(meta.description)}" />\n` +
          `<meta property="og:url" content="${url}" />\n<meta property="og:image" content="${SITE}/og-image.jpg" />\n` +
          `<meta name="twitter:card" content="summary_large_image" />`;
        const fallback = `<noscript><h1>${esc(meta.h1)}</h1><p>${esc(meta.description)}</p><nav>${nav}</nav></noscript>`;
        let html = base.replace(/<title>[\s\S]*?<\/title>/, head).replace('<div id="root"></div>', `<div id="root"></div>\n${fallback}`);
        const out = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
        fs.writeFileSync(path.join(dist, out), html);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), seoShells()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['gsap', 'lenis'],
        },
      },
    },
  },
});
