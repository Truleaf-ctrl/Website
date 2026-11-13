import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  ['/catalogue', 'Products'],
  ['/retail-to-business', 'Ready to Retail'],
  ['/blog', 'Blog'],
  ['/about', 'About Us'],
  ['/careers', 'Careers'],
  ['/company', 'Company'],
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Escape closes the phone menu and hands focus back to the button
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        document.getElementById('navToggle')?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav className="nav" id="nav">
      <Link to="/" className="nav__logo" aria-label="Truleaf home">
        <img src="/assets/icons/logo.svg" alt="Truleaf" className="nav__logo-img" />
      </Link>

      <button
        className={`nav__toggle${open ? ' is-open' : ''}`}
        id="navToggle"
        aria-expanded={open}
        aria-controls="navLinks"
        aria-label="Toggle navigation"
        onClick={() => setOpen((o) => !o)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav__links${open ? ' is-open' : ''}`} id="navLinks">
        {LINKS.map(([to, label]) => (
          <Link key={to} to={to} onClick={close}>
            {label}
          </Link>
        ))}
        <Link to="/contact" className="nav__cta nav__cta--mobile" onClick={close}>
          Get in touch
        </Link>
      </div>

      <Link to="/contact" className="nav__cta">
        Get in touch
      </Link>
    </nav>
  );
}
