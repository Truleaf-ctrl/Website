import { useEffect, useLayoutEffect } from 'react';

const SITE = 'https://truleaf.in';
const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (content == null) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Per-page document setup: title, SEO/social meta, the page's stylesheet stack and an optional body class.
 * `path` is the canonical path ("/about"); pass `path: null` for pages that had no canonical URL.
 */
export default function usePage({
  title,
  description,
  path,
  css,
  bodyClass,
  type = 'website',
  image = DEFAULT_IMAGE,
  robots,
  article,
  social = true,
}) {
  // stylesheet goes in before paint so the page never flashes unstyled
  useLayoutEffect(() => {
    if (!css) return undefined;
    const style = document.createElement('style');
    style.setAttribute('data-page-css', '');
    style.textContent = css;
    document.head.appendChild(style);
    return () => style.remove();
  }, [css]);

  useLayoutEffect(() => {
    if (!bodyClass) return undefined;
    document.body.classList.add(bodyClass);
    return () => document.body.classList.remove(bodyClass);
  }, [bodyClass]);

  useEffect(() => {
    if (title) document.title = title;
    setMeta('name', 'description', description ?? null);
    setMeta('name', 'robots', robots ?? null);
    const url = path != null ? `${SITE}${path}` : null;
    setCanonical(url);
    setMeta('property', 'og:type', social ? type : null);
    setMeta('property', 'og:site_name', social && type === 'website' ? 'Truleaf' : null);
    setMeta('property', 'og:title', social ? title : null);
    setMeta('property', 'og:description', social ? description : null);
    setMeta('property', 'og:url', social ? url : null);
    setMeta('property', 'og:image', social ? image : null);
    setMeta('name', 'twitter:card', social && type === 'website' ? 'summary_large_image' : null);
    setMeta('property', 'article:author', article ? article.author || '' : null);
    setMeta('property', 'article:published_time', article ? article.date || '' : null);
    setMeta('property', 'article:section', article ? article.category || '' : null);
  }, [title, description, path, type, image, robots, article, social]);
}
