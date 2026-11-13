import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { CountryOptions, DialCodeOptions, useCountryPhone } from '../components/CountryFields';
import Footer from '../components/Footer';
import usePage from '../hooks/usePage';
import useReveal, { revealAllStagger } from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { SITE_CSS } from '../styles/site';
import { sanityFetch, urlForImageRef } from '../lib/sanity';
import { sendForm } from '../lib/forms';

const BRIEF_LABEL = 'Request a Callback';

const CAT = '/assets/images/category-normalized/category-';
const BANNER_CARDS = [
  { src: `${CAT}pickles-cornichons.webp`, tone: 'green', label: 'Pickles & preserves' },
  { src: `${CAT}juices-purees.webp`, tone: 'peach', label: 'Juices & purees' },
  { src: `${CAT}edible-oils.webp`, tone: 'blue', label: 'Edible oils' },
  { src: `${CAT}healthy-snacks.webp`, tone: 'cream', label: 'Healthy snacks' },
  { src: `${CAT}ready-to-eat-products.webp`, tone: 'lav', label: 'Ready to eat' },
];

export default function SupplyChain() {
  usePage({
    title: 'Retail-Ready Product Development | Truleaf',
    description:
      'From product idea to retail-ready: sourcing, R&D, packaging, certification and logistics handled by Truleaf.',
    path: '/retail-to-business',
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  /* Categories You Can Private-Label: managed in the Studio (Category -> "Show on Private Label page").
     Shown as a table-style grid (not links). */
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    let alive = true;
    sanityFetch(
      `*[_type=="category" && privateLabel==true] | order(privateLabelOrder asc){name, shortDescription, "imageRef": image.asset._ref}`
    )
      .then((cats) => {
        if (!alive) return;
        setCategories(cats || []);
        requestAnimationFrame(revealAllStagger);
      })
      .catch((err) => console.error('Could not load categories from Sanity', err));
    return () => {
      alive = false;
    };
  }, []);

  // retail brief: emailed to info@truleaf.in
  const formRef = useRef(null);
  const [briefLabel, setBriefLabel] = useState(BRIEF_LABEL);
  const [sending, setSending] = useState(false);
  const { codeRef, codeRequired, onCountryChange, onPhoneInput } = useCountryPhone();
  const resetTimer = useRef(null);
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const onBriefSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.reportValidity()) return;
    setSending(true);
    setBriefLabel('Sending...');
    sendForm('brief', form).then((ok) => {
      setSending(false);
      if (ok) {
        form.reset();
        setBriefLabel('Sent. We will be in touch within one business day.');
        resetTimer.current = setTimeout(() => setBriefLabel(BRIEF_LABEL), 6000);
      } else {
        setBriefLabel(BRIEF_LABEL);
        window.alert('Sorry, your brief could not be sent. Please try again, or email info@truleaf.in.');
      }
    });
  };

  return (
    <>
      <header className="supply-hero supply-hero--split">
        <Nav />

        <div className="supply-banner__grid">
          <div className="supply-banner__copy reveal">
          <p className="supply-banner__eyebrow">Retail to Business</p>
          <h1 className="supply-banner__title">
            Got a product idea?
            <br />
            We&apos;ll make it <em>retail-ready.</em>
          </h1>
          <p className="supply-banner__body">
            From bulk ingredient to shelf-ready pack: sourcing, formulation, compliance and private-label production,
            under one roof.
          </p>
          <div className="supply-banner__actions">
            <Link to="/contact" className="supply-banner__btn supply-banner__btn--solid">
              Talk to Our Team
            </Link>
          </div>
        </div>

          <div className="supply-banner__visual">
            <img src="/assets/images/retail-hero-packed.webp" alt="Packed food ready for retail: bottled water, bagged pasta and canned goods" />
          </div>
        </div>
      </header>

      <main id="main">

      <section className="supply-process">
        <div className="content-wrap supply-process__inner">
          <div className="supply-process__header reveal">
            <div className="supply-process__heading">
              <p className="supply-process__eyebrow">How We Work</p>
              <h2 className="supply-process__title">
                A structured approach from
                <br />
                sourcing to delivery.
              </h2>
            </div>
          </div>

          <ol className="supply-process__steps reveal-stagger">
            <li className="supply-process__step">
              <img src="/assets/illustrations/step-1-brief.svg?v=4" alt="" className="supply-process__art" />
              <span className="supply-process__num">01</span>
              <h3>Share your brief.</h3>
              <p>Tell us your product idea and target market. We reply within one business day.</p>
            </li>
            <li className="supply-process__step">
              <img src="/assets/illustrations/step-2-build.svg?v=3" alt="" className="supply-process__art" />
              <span className="supply-process__num">02</span>
              <h3>We build it.</h3>
              <p>Formulation, sourcing, testing, certification and packaging, handled for you.</p>
            </li>
            <li className="supply-process__step">
              <img src="/assets/illustrations/step-3-deliver.svg?v=3" alt="" className="supply-process__art" />
              <span className="supply-process__num">03</span>
              <h3>We deliver.</h3>
              <p>Traceable supply from origin to your shelf, with a dedicated account team after launch.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="supply-categories">
        <div className="content-wrap supply-categories__grid">
          <div className="supply-categories__copy reveal">
            <p className="supply-eyebrow">PRIVATE LABEL</p>
            <h2 className="supply-heading">Categories You Can Private-Label</h2>
            <p>
              Start with ingredients already in our supply chain — organic and conventional, ready to source, formulate
              and pack at scale.
            </p>
          </div>

          <div className="supply-categories__list reveal-stagger" id="supplyCategoryList">
            {categories && (
              <ul className="supply-cells">
                {categories.map((c) => (
                  <li className="supply-cell" key={c.name}>
                    {c.imageRef ? <img loading="lazy" decoding="async" className="supply-cell__image" src={urlForImageRef(c.imageRef)} alt="" /> : null}
                    <h3 className="supply-cell__name">{c.name}</h3>
                    <p className="supply-cell__desc">{c.shortDescription || ''}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="content-wrap supply-categories__cta reveal">
          <Link to="/contact" className="btn supply-process__cta">
            Start Your Private Label
          </Link>
        </div>
      </section>

      <section className="cta-photo">
        <div className="cta-photo__frame cta-photo__frame--produce reveal">
          <div className="content-wrap cta-photo__inner">
            <div className="cta-photo__copy">
              <p className="cta-photo__eyebrow">Start a project</p>
              <h2 className="cta-photo__title">Tell us about your product idea.</h2>
              <Link to="/contact" className="btn btn--ghost cta-photo__cta">
                Talk to Our Team <img src="/assets/icons/arrow-right.svg" alt="" />
              </Link>
            </div>
            <div className="cta-photo__facts">
              <div className="cta-photo__fact">
                <p className="cta-photo__fact-label">Response time</p>
                <p className="cta-photo__fact-value">Within 1 Day</p>
              </div>
              <div className="cta-photo__fact">
                <p className="cta-photo__fact-label">Minimum Order</p>
                <p className="cta-photo__fact-value">Flexible</p>
                <p className="cta-photo__fact-note">based on ingredient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="supply-handle" id="supplyServices">
        <div className="content-wrap">
          <div className="supply-handle__intro reveal">
            <p className="supply-eyebrow">END-TO-END SUPPORT</p>
            <h2 className="supply-heading">Everything Between Your Idea And The Shelf.</h2>
          </div>

          <div className="supply-handle__grid reveal-stagger">
            <div className="supply-handle-card">
              <img src="/assets/icons/handle-rd.svg" alt="" className="supply-handle-card__icon" />
              <div className="supply-handle-card__text">
                <h3>R&amp;D &amp; Formulation</h3>
                <p>
                  Bring a new product idea and our R&amp;D team develops and scales the right ingredient blend for your
                  brand.
                </p>
              </div>
            </div>
            <div className="supply-handle-card">
              <img src="/assets/icons/handle-sourcing.svg" alt="" className="supply-handle-card__icon" />
              <div className="supply-handle-card__text">
                <h3>Vendor Sourcing</h3>
                <p>Our global sourcing team vets every supplier against quality, social and environmental standards.</p>
              </div>
            </div>
            <div className="supply-handle-card">
              <img src="/assets/icons/handle-safety.svg" alt="" className="supply-handle-card__icon" />
              <div className="supply-handle-card__text">
                <h3>Food Safety &amp; Compliance</h3>
                <p>Third-party audits and accredited lab testing at every stage of the supply chain.</p>
              </div>
            </div>
            <div className="supply-handle-card">
              <img src="/assets/icons/handle-packaging.svg" alt="" className="supply-handle-card__icon" />
              <div className="supply-handle-card__text">
                <h3>Packaging &amp; Label Support</h3>
                <p>Retail-ready pack design and label compliance for your target market.</p>
              </div>
            </div>
            <div className="supply-handle-card">
              <img src="/assets/icons/handle-certification.svg" alt="" className="supply-handle-card__icon" />
              <div className="supply-handle-card__text">
                <h3>Certification Guidance</h3>
                <p>Support for organic, export and market-specific certifications.</p>
              </div>
            </div>
            <div className="supply-handle-card">
              <img src="/assets/icons/handle-logistics.svg" alt="" className="supply-handle-card__icon" />
              <div className="supply-handle-card__text">
                <h3>Supply Chain &amp; Logistics</h3>
                <p>
                  Traceable, vertically integrated supply from origin to delivery, plus dedicated account support after
                  launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="supply-brief">
        <div className="supply-brief__stage">
          <div className="supply-brief__copy reveal">
            <p className="supply-eyebrow">GET STARTED</p>
            <h2 className="supply-brief__title">Talk to our team</h2>
            <p className="supply-brief__body">
              Share what you're sourcing and where you want to sell it. Our team will follow up with a sourcing and
              formulation plan.
            </p>
          </div>

          <form
            className="contact-card supply-brief__card reveal"
            id="supplyBriefForm"
            ref={formRef}
            onSubmit={onBriefSubmit}
          >
            <div className="contact-card__panel">
              <p className="contact-card__title">Send us your brief</p>
              <input
                type="text"
                name="website"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px' }}
              />

              <div className="contact-field">
                <label htmlFor="supplyName">Full name</label>
                <input type="text" id="supplyName" name="name" placeholder="Jane Doe" required />
              </div>

              <div className="contact-field">
                <label htmlFor="supplyEmail">Working Email</label>
                <input type="email" id="supplyEmail" name="email" placeholder="jane@company.com" required />
              </div>

              <div className="contact-field supply-brief__full">
                <label htmlFor="supplyPhone">Contact number</label>
                <div className="contact-field__phone">
                  <select
                    id="supplyPhoneCode"
                    name="phoneCode"
                    aria-label="Country code"
                    className="contact-field__code"
                    defaultValue=""
                    ref={codeRef}
                    required={codeRequired}
                  >
                    <DialCodeOptions />
                  </select>
                  <input
                    type="tel"
                    id="supplyPhone"
                    name="phone"
                    placeholder="555 123 4567"
                    autoComplete="tel-national"
                    onInput={onPhoneInput}
                  />
                </div>
              </div>

              <div className="contact-field supply-brief__full">
                <label htmlFor="supplyCountry">Country</label>
                <select id="supplyCountry" name="country" defaultValue="" onChange={onCountryChange}>
                  <CountryOptions />
                </select>
              </div>

              <div className="contact-field supply-brief__full">
                <label htmlFor="supplyProduct">Product of interest</label>
                <input type="text" id="supplyProduct" name="product" placeholder="e.g. Moringa powder" />
              </div>

              <div className="contact-field contact-field--grow supply-brief__full">
                <label htmlFor="supplyMessage">Message</label>
                <textarea
                  id="supplyMessage"
                  name="message"
                  placeholder="Tell us what you'd like to private-label..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn--primary contact-card__submit supply-brief__full"
                disabled={sending}
              >
                {briefLabel}
              </button>
            </div>
          </form>
        </div>
      </section>

      </main>


      <Footer />
    </>
  );
}
