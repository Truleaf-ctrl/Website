import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Truleaf home">
              <img className="footer-logo__mark" src="/assets/icons/footer-logo-mark.svg" alt="" />
              <img className="footer-logo__text" src="/assets/icons/footer-logo-text.svg" alt="Truleaf" />
              <img className="footer-logo__line" src="/assets/icons/footer-logo-underline.svg" alt="" />
            </Link>
            <p>
              Reliable organic sourcing for global markets. Traceable, certified agricultural exports from origin to
              international buyers.
            </p>
            <div className="footer-social">
              <a
                href="https://www.linkedin.com/company/truleaf-foods-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social__btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                </svg>
                <span>Follow us on LinkedIn</span>
              </a>
            </div>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h2>Company</h2>
              <ul>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/company">Code &amp; Policies / Speak Up</Link>
                </li>
                <li>
                  <Link to="/retail-to-business">Retail to Ready</Link>
                </li>
                <li>
                  <Link to="/catalogue">Product Catalogue</Link>
                </li>
                <li>
                  <Link to="/blog">Our Blog</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col footer-col--offices">
              <div className="footer-office">
                <h2>Registered office</h2>
                <address>
                  1A-1B Neem Square, KRG Nagar Main street, Ganapathy,
                  <br />
                  Coimbatore, Tamil Nadu, India 641006
                </address>
              </div>
              <div className="footer-office">
                <h2>Corporate office</h2>
                <address>
                  Innov8 SKCL Tech Square Guindy, 2nd Floor, No 14 SP, SIDCO, T.V.K industrial Estate, Guindy,
                  <br />
                  Chennai, Tamil Nadu, India 600032
                </address>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Truleaf Foods Private Limited</span>
          <span>
            <Link to="/privacy-policy">Privacy &amp; Cookie Policy</Link>
            {' · '}All Rights Reserved
          </span>
        </div>
      </div>
    </footer>
  );
}
