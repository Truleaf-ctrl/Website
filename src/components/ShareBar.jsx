import { useEffect, useRef, useState } from 'react';

const ICONS = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  facebook:
    'M13.5 21.95v-8.2h2.75l.42-3.2H13.5V8.5c0-.93.26-1.55 1.58-1.55h1.69V4.09c-.29-.04-1.29-.12-2.46-.12-2.43 0-4.1 1.48-4.1 4.2v2.38H7.45v3.2h2.76v8.2z',
  instagram:
    'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z',
  link: 'M10.59 13.41a1 1 0 010-1.41l3-3a3 3 0 114.24 4.24l-1.5 1.5-1.42-1.41 1.5-1.5a1 1 0 10-1.41-1.42l-3 3a1 1 0 01-1.41 0zm2.82-2.82a1 1 0 010 1.41l-3 3a3 3 0 11-4.24-4.24l1.5-1.5 1.42 1.41-1.5 1.5a1 1 0 101.41 1.42l3-3a1 1 0 011.41 0z',
};

function Icon({ name }) {
  return (
    <svg
      width={name === 'link' ? 24 : 18}
      height={name === 'link' ? 24 : 18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}

export default function ShareBar({ title }) {
  const [note, setNote] = useState('');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (msg) => {
    setNote(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(''), 2500);
  };

  const url = () => window.location.href.split('#')[0];
  const enc = encodeURIComponent;

  const open = (href) => window.open(href, '_blank', 'noopener,noreferrer,width=640,height=640');

  const onCopy = async () => flash((await copyText(url())) ? 'Link copied' : 'Could not copy link');

  // Instagram has no web share link, so copy the page link and open Instagram to paste it.
  const onInstagram = async () => {
    const ok = await copyText(url());
    flash(ok ? 'Link copied. Paste it in Instagram' : 'Could not copy link');
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="share-bar">
      <span className="share-bar__label">Share this article</span>
      <div className="share-bar__buttons">
        <button
          type="button"
          className="share-bar__btn"
          aria-label="Share on LinkedIn"
          onClick={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url())}`)}
        >
          <Icon name="linkedin" />
        </button>
        <button
          type="button"
          className="share-bar__btn"
          aria-label="Share on X"
          onClick={() => open(`https://twitter.com/intent/tweet?url=${enc(url())}&text=${enc(title || '')}`)}
        >
          <Icon name="x" />
        </button>
        <button type="button" className="share-bar__btn" aria-label="Share on Instagram" onClick={onInstagram}>
          <Icon name="instagram" />
        </button>
        <button
          type="button"
          className="share-bar__btn"
          aria-label="Share on Facebook"
          onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url())}`)}
        >
          <Icon name="facebook" />
        </button>
        <button type="button" className="share-bar__btn" aria-label="Copy link" onClick={onCopy}>
          <Icon name="link" />
        </button>
      </div>
      <span className="share-bar__note" role="status" aria-live="polite">
        {note}
      </span>
    </div>
  );
}
