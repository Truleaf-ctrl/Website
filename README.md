# Truleaf website (React)

The Truleaf site rebuilt as a React app: Vite + React 18 + React Router 6, with GSAP and Lenis for the motion.
Content still comes from your Sanity project (`qir915mw`), and forms still post to `send-form.php`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview    # serve the built site locally
```

## Deploy (Hostinger)

Upload the **contents of `dist/`** to `public_html`. `dist/` already includes `send-form.php`, `robots.txt`,
`sitemap.xml` and an `.htaccess` that sends every URL to `index.html` so React Router can handle `/about`, `/blog`, etc.
`send-form.php` is PHP, so form submissions only work on the real host, not under `npm run dev`.

Old links such as `/about.html` or `/blog-post.html?post=…` redirect to the new clean URLs.

## Structure

```
src/
  main.jsx, App.jsx          entry + routes (pages are lazy-loaded)
  pages/                     Home, About, Blog, BlogPost, Careers, Catalogue, Contact,
                             ProductsCoconut, Search, SupplyChain, PrdTemplate, ProjectPrdTemplate
  components/                Nav, Footer, AppShell (smooth scroll + progress bar), SearchBox (type-ahead),
                             CategoryCard, TrendCard, BlogCard, PortableText, CountryFields, Highlight
  context/ProductOverlay.jsx product bottom sheet: call useProductOverlay().openProduct(data) from anywhere
  hooks/                     usePage (title/meta/css per page), useReveal, useMotion (parallax/curtains),
                             useHomeAnimations (hero carousel + GSAP scenes)
  lib/                       sanity.js, search.js, forms.js, countries.js
  styles/                    your original CSS, unchanged apart from asset paths
public/                      images, icons, send-form.php, .htaccess
studio/                      Sanity Studio and seed scripts (unchanged)
```

## Notes

- The CSS is your original CSS, mounted per page. The home page and the inner pages use different stylesheet
  stacks that define some of the same selectors differently, so each page loads only its own.
- `src/pages/Careers.jsx` keeps the role list in a `ROLES` array at the top: edit it there.
- Blog fallback data (`assets/blog-posts.js`) was never referenced by any page, so it was not ported.
