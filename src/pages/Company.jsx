import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePage from '../hooks/usePage';
import useReveal from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { SITE_CSS } from '../styles/site';

const SPEAK_UP_MAIL = 'mailto:info@truleaf.in?subject=Speak%20Up';

const POLICIES = [
  {
    title: 'Code of Conduct',
    body: 'The standards of honesty, respect and accountability we expect from everyone who works with or for Truleaf.',
  },
  {
    title: 'Anti-Bribery & Corruption',
    body: 'We do not offer, pay or accept bribes. Gifts, hospitality and facilitation payments are tightly controlled.',
  },
  {
    title: 'Quality & Food Safety',
    body: 'Traceable, certified, compliant. Every lot is documented from origin to shipment against export standards.',
  },
  {
    title: 'Human Rights & Fair Labour',
    body: 'No child or forced labour, fair pay and safe working conditions across our farms, processors and offices.',
  },
  {
    title: 'Environment & Sustainability',
    body: 'Organic, responsible practices that protect soil, water and the farming communities we source from.',
  },
  {
    title: 'Supplier Code',
    body: 'What we ask of every farmer group, processor and partner: transparency, traceability and ethical conduct.',
  },
  {
    title: 'Data Privacy',
    body: 'How we collect, use and protect personal information from customers, partners and job applicants.',
  },
  {
    title: 'Conflicts of Interest',
    body: 'We disclose and manage any personal interest that could influence a business decision.',
  },
];

const SPEAK_UP_STEPS = [
  { n: '01', title: 'Raise it', body: 'Tell us what you saw or experienced, in your own words, by email. You can stay anonymous.' },
  { n: '02', title: 'We review', body: 'A senior person independent of the issue reads every report and decides how to look into it.' },
  { n: '03', title: 'We act', body: 'We investigate fairly, take corrective action where needed, and update you where we can.' },
];

const REPORTABLE = [
  'Bribery, fraud or corruption',
  'Food safety or quality concerns',
  'Harassment, discrimination or unsafe conditions',
  'Forced or child labour in our supply chain',
  'Conflicts of interest or misuse of company assets',
  'Anything that feels wrong or against our Code',
];

export default function Company() {
  usePage({
    title: 'Company | Truleaf',
    description:
      'Our Code & Policies and Speak Up: the standards Truleaf holds itself to, and how to raise a concern safely.',
    path: '/company',
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  return (
    <>
      <header className="company-hero">
        <Nav />
        <div className="company-hero__content content-wrap reveal">
          <p className="company-eyebrow">Company</p>
          <h1 className="company-hero__title">Doing business the way food should be grown: honestly.</h1>
          <p className="company-hero__body">
            Trust is what we sell. Here is how we hold ourselves to account, and how you can tell us when we fall short.
          </p>
        </div>

        <div className="company-cats content-wrap reveal">
          <a className="company-cat company-cat--light" href="#policies">
            <span className="company-cat__num">01</span>
            <h2>Our Code &amp; Policies</h2>
            <p>The principles and policies that guide every decision, from the farm gate to the port.</p>
            <span className="company-cat__link">
              Read our policies <img src="/assets/icons/arrow-right.svg" alt="" />
            </span>
          </a>
          <a className="company-cat company-cat--dark" href="#speak-up">
            <span className="company-cat__num">02</span>
            <h2>Speak Up</h2>
            <p>See something that isn't right? Raise it safely and confidentially. We will listen and act.</p>
            <span className="company-cat__link">
              How to raise a concern <img src="/assets/icons/arrow-right.svg" alt="" />
            </span>
          </a>
        </div>
      </header>

      <section className="company-policies" id="policies">
        <div className="content-wrap">
          <div className="company-head reveal">
            <p className="company-eyebrow">01 · Our Code &amp; Policies</p>
            <h2 className="company-h2">The standards we hold ourselves to.</h2>
            <p className="company-lede">
              Our Code of Conduct and supporting policies apply to our people, our suppliers and everyone who acts on
              Truleaf's behalf.
            </p>
          </div>
          <ul className="company-policy-grid">
            {POLICIES.map((p) => (
              <li key={p.title} className="company-policy reveal">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="company-note reveal">
            Need a full copy of a policy for an audit or due diligence? <a href="mailto:info@truleaf.in?subject=Policy%20request">Request it from our team</a>.
          </p>
        </div>
      </section>

      <section className="company-speakup" id="speak-up">
        <div className="content-wrap">
          <div className="company-head company-head--dark reveal">
            <p className="company-eyebrow">02 · Speak Up</p>
            <h2 className="company-h2">If something isn't right, tell us.</h2>
            <p className="company-lede">
              We want to hear about concerns early. Speaking up in good faith is always the right thing to do, and you
              will never be penalised for it.
            </p>
          </div>

          <ol className="company-steps">
            {SPEAK_UP_STEPS.map((s) => (
              <li key={s.n} className="company-step reveal">
                <span className="company-step__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="company-speakup__grid">
            <div className="company-panel reveal">
              <h3>What you can report</h3>
              <ul>
                {REPORTABLE.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="company-panel company-panel--cta reveal">
              <h3>Our promise to you</h3>
              <p>
                Reports are treated confidentially and shared only with those who need to investigate. We do not
                tolerate retaliation against anyone who raises a concern in good faith.
              </p>
              <a className="btn company-btn" href={SPEAK_UP_MAIL}>
                Speak up by email <img src="/assets/icons/arrow-right.svg" alt="" />
              </a>
              <Link className="company-panel__alt" to="/contact">
                Or use our contact page
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
