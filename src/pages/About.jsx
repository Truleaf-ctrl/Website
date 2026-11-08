import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePage from '../hooks/usePage';
import useReveal from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { SITE_CSS } from '../styles/site';

export default function About() {
  usePage({
    title: 'About Us | Truleaf',
    description:
      'Meet Truleaf: how we build trust in organic sourcing through certified farmer partnerships, full traceability and transparent documentation.',
    path: '/about',
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  return (
    <>
      <header className="about-hero">
        <Nav />

        <div className="about-hero__content content-wrap reveal">
          <h1 className="about-hero__title">
            We didn't set out to sell ingredients.
            <br />
            We set out to fix trust.
          </h1>
          <p className="about-hero__body">
            Born in 2022 from a young Food Engineer’s decision to build something of his own, Truleaf Foods is rooted in
            the values of Southern Tamil Nadu and guided by faith, knowledge and a commitment to trusted food.
          </p>
        </div>
      </header>

      <section className="about-splithero reveal">
        <img src="/assets/images/about-hero-wheat.jpg" alt="Green wheat ears lying in the field" />
        <blockquote className="about-splithero__quote">
          <p>
            &ldquo;Every ingredient has a source, a story, and a standard. Our responsibility is to make sure all three
            can be trusted.&rdquo;
          </p>
          <cite>Charles R, Founder</cite>
        </blockquote>
      </section>

      <section className="about-origin">
        <div className="content-wrap">
          <div className="about-origin__head reveal">
            <p className="about-eyebrow">Where it began</p>
            <h2 className="about-origin__title">
              From Food Processing Engineer to Entrepreneur, Driven by a Deep-Rooted Passion for Food Processing, Food
              Safety &amp; Innovation.
            </h2>
          </div>

          <div className="about-origin__story">
            <div className="about-origin__image reveal">
              <img
                src="/assets/images/founders-origin.jpg?v=10"
                alt="Renious Charles and John Wesley, the Truleaf co-founders"
              />
            </div>
            <div className="about-origin__text reveal">
              <p className="about-origin__intro">
                In 2018, <strong>Renious Charles and John Wesley</strong>, two Food Processing Engineers, saw a gap
                between India&rsquo;s rich food potential and what global buyers expected:{' '}
                <strong>consistent quality, food safety, traceability and reliable supply</strong>.
              </p>
              <p>
                With experience across food processing, quality systems, certification, food safety and farm-level
                sourcing, they understood the challenges from within the industry.
              </p>
              <p>
                That led to the creation of <strong>Truleaf Foods</strong>, built not simply to trade food products, but
                to <strong>verify, source and deliver them with confidence</strong>.
              </p>
              <p>
                Today, we connect trusted Indian producers and processors with buyers in India and international
                markets, combining <strong>food science, food safety and supply-chain discipline</strong>.
              </p>
              <p className="about-origin__pull">From source to shipment, we build food supply with confidence.</p>
            </div>
          </div>

          <div className="about-origin__rows reveal-stagger">
            <article className="about-origin__row">
              <h3>From India to the world</h3>
              <div className="about-origin__row-body">
                <p>
                  India has an extraordinary agricultural and food-processing ecosystem. Our ambition is to connect that
                  strength with buyers who expect international standards of quality, consistency and compliance.
                </p>
                <p>
                  Today, Truleaf Foods works across{' '}
                  <strong>
                    fresh and processed fruits and vegetables, coconut products, frozen foods, preserved and acidified
                    products
                  </strong>
                  .
                </p>
                <p>
                  It is about moving <strong>quality, confidence and trust</strong> with every shipment.
                </p>
              </div>
            </article>
            <article className="about-origin__row">
              <h3>Two food engineers. One shared belief.</h3>
              <div className="about-origin__row-body">
                <p>
                  Truleaf Foods was born from the belief that food-processing professionals can do more than work within
                  the industry.
                </p>
                <p className="about-origin__highlight">They can build the industry they believe in.</p>
                <p>
                  What started with two Food Processing Engineers questioning the way food was sourced has grown into a
                  company focused on building a more reliable connection between{' '}
                  <strong>Indian producers and global food businesses</strong>.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="about-break">
        <div className="about-origin__close reveal">
          <p className="about-origin__closing">From source to shipment, we are building food supply with confidence.</p>
          <p className="about-origin__sign">
            <strong>Truleaf Foods Private Limited</strong>
            <em>Truth to be Tasted.</em>
          </p>
          <Link to="/catalogue" className="btn btn--primary about-origin__cta">
            Browse catalogue
          </Link>
        </div>
      </section>

      <section className="about-work">
        <div className="content-wrap about-work__grid">
          <div className="about-work__intro reveal">
            <div className="about-work__heading">
              <p className="about-eyebrow">How we work</p>
              <h2 className="about-heading">A structured approach, from sourcing to delivery.</h2>
            </div>
            <p>
              Rooted in Southern Tamil Nadu and backed by 10+ years of industry experience, Truleaf Foods combines Food
              Engineering knowledge with a practical understanding of sourcing, quality, and regulatory requirements. We
              connect suppliers and markets through dependable relationships, thoughtful product selection, and a
              commitment to responsible trade.
            </p>
          </div>
          <div className="about-feature-list reveal-stagger">
            <div className="about-feature-row">
              <img src="/assets/icons/value-sourcing.svg" alt="" className="about-feature-row__icon" />
              <h3>Responsible Sourcing</h3>
              <p>
                We work to identify suitable suppliers for fresh fruits and vegetables, raw materials, and ingredients,
                considering product specifications, availability, quality expectations, and customer requirements.
              </p>
            </div>
            <div className="about-feature-row">
              <img src="/assets/icons/handle-rd.svg" alt="" className="about-feature-row__icon" />
              <h3>Quality with Technical Understanding</h3>
              <p>
                Our Food Engineering foundation helps us understand product characteristics, quality parameters,
                specifications, and relevant regulatory requirements when evaluating sourcing opportunities.
              </p>
            </div>
            <div className="about-feature-row">
              <img src="/assets/icons/value-global.svg" alt="" className="about-feature-row__icon" />
              <h3>Trade &amp; Supply Coordination</h3>
              <p>
                We coordinate with suppliers and customers on product requirements, commercial terms, documentation, and
                logistics to support smooth domestic and international trade.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-people">
        <div className="content-wrap">
          <div className="about-people__intro reveal">
            <p className="about-eyebrow">The people</p>
            <h2 className="about-heading">
              Behind every shipment is a team that's been inside this industry for years.
            </h2>
          </div>

          <div className="about-people__grid reveal-stagger">
            <article className="about-person">
              <img
                src="/assets/images/founder-renious.jpg"
                alt="Portrait of Renious Charles, Director, Commercial & Technical"
                className="about-person__image"
              />
              <div className="about-person__card">
                <p className="about-person__name">Renious Charles</p>
                <p className="about-person__role">Director, Commercial &amp; Technical</p>
                <p className="about-person__bio">
                  With a background in Food Processing Engineering and over 10 years of industry experience, Renious
                  founded Truleaf Foods in 2022 with a vision to build a trusted business in agricultural products and
                  ingredients. His experience in food quality, processing, and regulatory compliance informs the
                  company’s approach to sourcing, supplier relationships, and responsible trade.
                </p>
              </div>
            </article>

            <article className="about-person">
              <img
                src="/assets/images/founder-john.jpg"
                alt="Portrait of John Wesley, Director, Finance"
                className="about-person__image"
              />
              <div className="about-person__card">
                <p className="about-person__name">John Wesley</p>
                <p className="about-person__role">Director, Finance</p>
                <p className="about-person__bio">
                  A Food Technology and Processing postgraduate with 10 years of experience across the dairy, beverage,
                  and food processing industries, John brings expertise in manufacturing operations, process control,
                  food safety, and quality systems. He contributes practical industry knowledge and a process-driven
                  perspective to Truleaf Foods’ commitment to quality and reliable sourcing.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="about-integrity">
        <div className="content-wrap">
          <div className="about-integrity__intro reveal">
            <div className="about-integrity__heading">
              <p className="about-eyebrow">Our principles</p>
              <h2 className="about-heading">Trust isn't claimed. It's built into every relationship.</h2>
            </div>
            <p className="about-integrity__body">
              We operate under full legal and ethical compliance not because we're required to, but because it's the
              only way to build something that lasts.
              <br />
              <br />
              Our code of conduct, trade terms, and supply chain due diligence standards exist for one reason: so that
              every party in a Truleaf transaction can trust what they're looking at.
            </p>
          </div>

          <div className="about-feature-grid reveal-stagger">
            <div className="about-feature-cell">
              <img src="/assets/icons/value-terms.svg" alt="" className="about-feature-row__icon" />
              <h3>Transparent trade terms.</h3>
              <p>
                Every agreement is governed by clearly defined legal terms: no ambiguity, no hidden conditions. What's
                agreed is what's delivered.
              </p>
            </div>
            <div className="about-feature-cell">
              <img src="/assets/icons/value-sourcing.svg" alt="" className="about-feature-row__icon" />
              <h3>Responsible sourcing.</h3>
              <p>
                We follow recognised ethical sourcing standards and proactively manage environmental and social risks
                across our supply network.
              </p>
            </div>
            <div className="about-feature-cell">
              <img src="/assets/icons/value-accountability.svg" alt="" className="about-feature-row__icon" />
              <h3>Accountability at every step.</h3>
              <p>
                Our due diligence system means we know exactly what happened to an ingredient before it became your
                product.
              </p>
            </div>
            <div className="about-feature-cell">
              <img src="/assets/icons/value-relationships.svg" alt="" className="about-feature-row__icon" />
              <h3>Long relationships.</h3>
              <p>
                We measure success in repeat orders and client growth, not one-off deals. Your supply chain stability is
                our business continuity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta reveal">
        <img src="/assets/images/about-cta-oranges.jpg" alt="" className="about-cta__bg" />
        <div className="about-cta__content">
          <h2>If you've been looking for a sourcing partner you don't have to second-guess:</h2>
          <p>
            That's exactly the gap Truleaf was built to fill. Come talk to us about what you need, and we'll tell you
            honestly whether we can deliver it.
          </p>
          <Link to="/contact" className="btn btn--primary">
            Talk to our team
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
