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
              <a href="#" aria-label="Facebook">
                FB
              </a>
              <a href="#" aria-label="Twitter">
                TW
              </a>
              <a href="#" aria-label="LinkedIn">
                LI
              </a>
              <a href="#" aria-label="Instagram">
                IG
              </a>
            </div>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/supply-chain">Ready to Retail</Link>
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
                <h4>Registered office</h4>
                <address>
                  1A-1B Neem Square, KRG Nagar Main street, Ganapathy,
                  <br />
                  Coimbatore, Tamil Nadu, India 641006
                </address>
              </div>
              <div className="footer-office">
                <h4>Corporate office</h4>
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
          <span>© 2026 Truleaf Exports</span>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
