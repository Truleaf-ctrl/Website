import { useRef, useState } from 'react';
import Nav from '../components/Nav';
import { CountryOptions, DialCodeOptions, useCountryPhone } from '../components/CountryFields';
import Footer from '../components/Footer';
import usePage from '../hooks/usePage';
import useReveal from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { SITE_CSS } from '../styles/site';
import { EMAIL_PATTERN, sendForm } from '../lib/forms';
import { SEO } from '../lib/seoPages';

export default function Contact() {
  usePage({
    title: SEO['/contact'].title,
    description: SEO['/contact'].description,
    path: '/contact',
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  const formRef = useRef(null);
  const emailRef = useRef(null);
  const [panel, setPanel] = useState('form'); // 'form' | 'success' | 'error'
  const [emailError, setEmailError] = useState(false);
  const [sending, setSending] = useState(false);
  const { codeRef, codeRequired, onCountryChange, onPhoneInput } = useCountryPhone();

  const onSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.reportValidity()) return;

    const isValidEmail = EMAIL_PATTERN.test(emailRef.current.value.trim());
    setEmailError(!isValidEmail);
    if (!isValidEmail) {
      emailRef.current.focus();
      return;
    }

    setSending(true);
    sendForm('contact', form).then((didSucceed) => {
      setSending(false);
      setPanel(didSucceed ? 'success' : 'error');
    });
  };

  const sendAnother = () => {
    formRef.current.reset();
    setEmailError(false);
    setPanel('form');
  };

  return (
    <>
      <main id="main">
      <section className="contact" id="contact">
        <div className="contact__hero">
          <div className="contact__hero-inner content-wrap">
            <Nav />

            <div className="contact__grid">
              <div className="contact-copy reveal">
                <p className="contact-copy__eyebrow">Get in touch</p>
                <h1 className="contact-copy__title">Let's talk sourcing.</h1>
                <p className="contact-copy__body">
                  Whether you need a quote, a sample, or want to discuss a bulk program, our sourcing team responds
                  within one business day.
                </p>

                <div className="contact-copy__list">
                  <div className="contact-copy__item">
                    <span className="contact-copy__label">Email</span>
                    <a href="mailto:info@truleaf.in" className="contact-copy__value contact-copy__link">
                      info@truleaf.in
                    </a>
                  </div>
                  <div className="contact-copy__item">
                    <span className="contact-copy__label">Registered office</span>
                    <span className="contact-copy__value">
                      1A-1B Neem Square, KRG Nagar Main street, Ganapathy, Coimbatore, Tamil Nadu, India 641006
                    </span>
                  </div>
                  <div className="contact-copy__item">
                    <span className="contact-copy__label">Corporate office</span>
                    <span className="contact-copy__value">
                      Innov8 SKCL Tech Square Guindy, 2nd Floor, No 14 SP, SIDCO, T.V.K industrial Estate, Guindy,
                      Chennai, Tamil Nadu, India 600032
                    </span>
                  </div>
                </div>
              </div>

              <div className="contact-card reveal" id="contactCard">
                <form
                  className="contact-card__panel"
                  id="contactForm"
                  noValidate
                  ref={formRef}
                  onSubmit={onSubmit}
                  hidden={panel !== 'form'}
                >
                  <p className="contact-card__title">Send us a message</p>
                  <input
                    type="text"
                    name="website"
                    tabIndex="-1"
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px' }}
                  />

                  <div className="contact-field">
                    <label htmlFor="contactName">Full name</label>
                    <input type="text" id="contactName" name="name" placeholder="Jane Doe" required />
                  </div>

                  <div className={`contact-field${emailError ? ' contact-field--error' : ''}`} id="contactEmailField">
                    <label htmlFor="contactEmail">Work email</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="email"
                      placeholder="jane@company.com"
                      required
                      ref={emailRef}
                      aria-invalid={emailError || undefined}
                      aria-describedby={emailError ? 'contactEmailError' : undefined}
                      onInput={() => emailError && setEmailError(false)}
                    />
                    <p className="contact-field__error" id="contactEmailError" role="alert" hidden={!emailError}>
                      Please enter a valid work email address.
                    </p>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contactPhone">Contact number</label>
                    <div className="contact-field__phone">
                      <select
                        id="contactPhoneCode"
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
                        id="contactPhone"
                        name="phone"
                        placeholder="555 123 4567"
                        autoComplete="tel-national"
                        onInput={onPhoneInput}
                      />
                    </div>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contactCountry">Country</label>
                    <select id="contactCountry" name="country" required defaultValue="" onChange={onCountryChange}>
                      <CountryOptions />
                    </select>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contactProduct">Product of interest</label>
                    <select id="contactProduct" name="product" required defaultValue="">
                      <option value="">Select a product</option>
                      <option value="Coconut Milk">Coconut Milk</option>
                      <option value="Coconut Cream">Coconut Cream</option>
                      <option value="Desiccated Coconut">Desiccated Coconut</option>
                      <option value="Extra Virgin Coconut Oil">Extra Virgin Coconut Oil</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="contact-field contact-field--grow">
                    <label htmlFor="contactMessage">Message</label>
                    <textarea
                      id="contactMessage"
                      name="message"
                      placeholder="Tell us what you're sourcing..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn--primary contact-card__submit" disabled={sending}>
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>

                <div
                  className="contact-card__panel contact-card__panel--state"
                  id="contactSuccess"
                  role="status"
                  hidden={panel !== 'success'}
                >
                  <div className="contact-card__icon contact-card__icon--success">
                    <img src="/assets/icons/state-success.svg" alt="" />
                  </div>
                  <p className="contact-card__state-title">Message sent!</p>
                  <p className="contact-card__state-desc">
                    Thanks for reaching out. Our sourcing team will get back to you within one business day.
                  </p>
                  <button type="button" className="btn btn--outline" id="sendAnotherBtn" onClick={sendAnother}>
                    Send Another Message
                  </button>
                </div>

                <div
                  className="contact-card__panel contact-card__panel--state"
                  id="contactError"
                  role="alert"
                  hidden={panel !== 'error'}
                >
                  <div className="contact-card__icon contact-card__icon--error">
                    <img src="/assets/icons/state-error.svg" alt="" />
                  </div>
                  <p className="contact-card__state-title">Message failed to send</p>
                  <p className="contact-card__state-desc">
                    Something went wrong on our end and your message didn't go through. Please try again, or email us
                    directly at info@truleaf.in.
                  </p>
                  <div className="contact-card__actions">
                    <button
                      type="button"
                      className="btn btn--primary contact-card__action"
                      id="tryAgainBtn"
                      onClick={() => setPanel('form')}
                    >
                      Try Again
                    </button>
                    <a href="mailto:info@truleaf.in" className="btn btn--outline contact-card__action">
                      Email Us Instead
                    </a>
                  </div>
                </div>
              </div>

              {/* stacked layouts only: contact details follow the form (the copy above is hidden there) */}
              <div className="contact-copy contact-copy--details">
                <div className="contact-copy__list">
                  <div className="contact-copy__item">
                    <span className="contact-copy__label">Email</span>
                    <a href="mailto:info@truleaf.in" className="contact-copy__value contact-copy__link">
                      info@truleaf.in
                    </a>
                  </div>
                  <div className="contact-copy__item">
                    <span className="contact-copy__label">Registered office</span>
                    <span className="contact-copy__value">
                      1A-1B Neem Square, KRG Nagar Main street, Ganapathy, Coimbatore, Tamil Nadu, India 641006
                    </span>
                  </div>
                  <div className="contact-copy__item">
                    <span className="contact-copy__label">Corporate office</span>
                    <span className="contact-copy__value">
                      Innov8 SKCL Tech Square Guindy, 2nd Floor, No 14 SP, SIDCO, T.V.K industrial Estate, Guindy,
                      Chennai, Tamil Nadu, India 600032
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>


      <Footer />
    </>
  );
}
