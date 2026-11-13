import { useEffect, useRef, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePage from '../hooks/usePage';
import useReveal from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { SITE_CSS } from '../styles/site';
import { EMAIL_PATTERN, sendForm } from '../lib/forms';
import { sanityFetch } from '../lib/sanity';

const TEAM_ORDER = ['Sourcing', 'Quality', 'R&D', 'Operations', 'Marketing'];

// Shown only until the live listings load, or if they can't be reached.
const FALLBACK_ROLES = [
  {
    team: 'Sourcing',
    title: 'Sourcing Manager',
    location: 'Coimbatore, India',
    summary: 'Build and manage relationships with certified organic farmer groups and processors across India.',
  },
  {
    team: 'Quality',
    title: 'Quality Assurance Executive',
    location: 'Coimbatore, India',
    summary: 'Run lab testing, audits and documentation so every lot ships compliant with export standards.',
  },
  {
    team: 'R&D',
    title: 'R&D Food Technologist',
    location: 'Coimbatore, India',
    summary: 'Develop and scale ingredient blends with brand partners, from first sample to production.',
  },
  {
    team: 'Operations',
    title: 'Export Operations Executive',
    location: 'Coimbatore, India',
    summary: 'Coordinate orders, shipping documents and customs for buyers around the world.',
  },
  {
    team: 'Operations',
    title: 'Logistics Coordinator',
    location: 'Coimbatore, India',
    summary: 'Keep traceable supply moving from origin to port to delivery, on time and fully tracked.',
  },
  {
    team: 'Marketing',
    title: 'Brand & Content Marketer',
    location: 'Remote, India',
    summary: 'Tell the story of our ingredients and the farmers behind them across web and social.',
  },
];

const FILE_HINT = 'PDF, DOC or DOCX, up to 5 MB';
const MAX_FILE = 5 * 1024 * 1024;
const fileOk = (f) => !!f && f.size <= MAX_FILE && /\.(pdf|docx?)$/i.test(f.name);

export default function Careers() {
  usePage({
    title: 'Careers | Truleaf',
    description: 'Join Truleaf and work across sourcing, quality, R&D and export operations. See open roles and apply.',
    path: '/careers',
    css: SITE_CSS,
    bodyClass: 'careers',
  });
  useReveal();
  useMotion();

  // ---- job listings (managed in Sanity; static list is the fallback)
  const [roles, setRoles] = useState(FALLBACK_ROLES);
  useEffect(() => {
    let live = true;
    sanityFetch(
      `*[_type=="job" && active != false] | order(order asc, _createdAt asc){title, team, location, employmentType, summary}`
    )
      .then((rows) => {
        if (live && Array.isArray(rows)) setRoles(rows.filter((r) => r && r.title));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  const teamsPresent = [...new Set(roles.map((r) => r.team).filter(Boolean))];
  const TEAMS = [
    'All',
    ...TEAM_ORDER.filter((t) => teamsPresent.includes(t)),
    ...teamsPresent.filter((t) => !TEAM_ORDER.includes(t)),
  ];

  // ---- role filter
  const [filter, setFilter] = useState('All');
  const activeFilter = TEAMS.includes(filter) ? filter : 'All';
  const shownCount = roles.filter((r) => activeFilter === 'All' || r.team === activeFilter).length;

  // ---- form
  const formRef = useRef(null);
  const emailRef = useRef(null);
  const fileRef = useRef(null);
  const [role, setRole] = useState('General application');
  const [emailError, setEmailError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [fileName, setFileName] = useState(FILE_HINT);
  const [submitting, setSubmitting] = useState(false);
  const [successName, setSuccessName] = useState(null);

  // Apply buttons preselect the role and jump to the form
  const goApply = (title) => {
    setRole(title);
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    setFileName(f ? f.name : FILE_HINT);
    setFileError(f ? !fileOk(f) : false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    const emailOk = EMAIL_PATTERN.test(emailRef.current.value.trim());
    const resumeOk = fileOk(fileRef.current.files[0]);
    setEmailError(!emailOk);
    setFileError(!resumeOk);
    if (!form.checkValidity() && !form.reportValidity()) return;
    if (!emailOk) {
      emailRef.current.focus();
      return;
    }
    if (!resumeOk) {
      fileRef.current.focus();
      return;
    }

    setSubmitting(true);
    sendForm('careers', form).then((ok) => {
      setSubmitting(false);
      if (!ok) {
        window.alert(
          'Sorry, your application could not be sent. Please try again, or email info@truleaf.in with your resume.'
        );
        return;
      }
      setSuccessName(form.elements.name.value.trim().split(' ')[0]);
    });
  };

  const sendAnother = () => {
    formRef.current.reset();
    setRole('General application');
    setFileName(FILE_HINT);
    setSuccessName(null);
  };

  return (
    <>
      <header className="supply-hero careers-hero">
        <Nav />

        <div className="supply-hero__content reveal">
          <p className="supply-hero__eyebrow">CAREERS</p>
          <h1 className="supply-hero__title">Build a career rooted in good food.</h1>
          <p className="supply-hero__body">
            Join the team connecting certified organic farms to kitchens around the world. We are looking for curious,
            careful people who care where food comes from.
          </p>
          <div className="supply-hero__cta-row">
            <a href="#roles" className="btn btn--ghost">
              See open roles <img src="/assets/icons/arrow-right.svg" alt="" />
            </a>
          </div>
        </div>
      </header>

      <main id="main">

      <section className="careers-why">
        <div className="content-wrap careers-why__inner">
          <div className="careers-why__head reveal">
            <p className="supply-eyebrow">WHY WORK WITH US</p>
            <h2 className="supply-heading">A team that cares about the whole chain.</h2>
            <p className="careers-why__lede">
              We are small enough that your work matters and global enough that it travels far. Here is what you can
              expect.
            </p>
          </div>

          <div className="careers-why__grid reveal-stagger">
            <div className="careers-why__item">
              <img className="careers-why__icon" src="/assets/icons/perk-travels.svg" alt="" width="40" height="40" />
              <h3>Work that travels</h3>
              <p>
                Your work reaches kitchens and shelves across the globe. Sourcing, quality and logistics all connect to
                buyers in many markets.
              </p>
            </div>
            <div className="careers-why__item">
              <img className="careers-why__icon" src="/assets/icons/perk-chain.svg" alt="" width="40" height="40" />
              <h3>See the whole chain</h3>
              <p>
                We are vertically integrated, so you learn the business from the farm gate to the final delivery, not
                just one corner of it.
              </p>
            </div>
            <div className="careers-why__item">
              <img className="careers-why__icon" src="/assets/icons/perk-practice.svg" alt="" width="40" height="40" />
              <h3>Rooted in good practice</h3>
              <p>
                We work with certified organic farmer groups and fair-trade partners. The sustainability goals are part
                of the job, not a poster.
              </p>
            </div>
            <div className="careers-why__item">
              <img className="careers-why__icon" src="/assets/icons/perk-ownership.svg" alt="" width="40" height="40" />
              <h3>Real ownership</h3>
              <p>
                A focused team where your ideas ship. You will own projects early and see the result of your work
                quickly.
              </p>
            </div>
            <div className="careers-why__item">
              <img className="careers-why__icon" src="/assets/icons/perk-growth.svg" alt="" width="40" height="40" />
              <h3>Room to grow</h3>
              <p>
                Learn across sourcing, food technology, compliance and trade. We back your growth with mentoring and
                time to learn.
              </p>
            </div>
            <div className="careers-why__item">
              <img className="careers-why__icon" src="/assets/icons/perk-team.svg" alt="" width="40" height="40" />
              <h3>A team that backs you</h3>
              <p>
                Direct, kind and curious colleagues. We celebrate good work, share credit and look after each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="careers-roles" id="roles">
        <div className="content-wrap careers-roles__inner">
          <div className="careers-roles__head reveal">
            <div>
              <p className="supply-eyebrow">OPEN ROLES</p>
              <h2 className="supply-heading">Find your place on the team.</h2>
            </div>
            <div className="careers-filters" role="group" aria-label="Filter roles by team">
              {TEAMS.map((team) => (
                <button
                  key={team}
                  type="button"
                  className={`careers-chip${activeFilter === team ? ' is-active' : ''}`}
                  data-filter={team}
                  onClick={() => setFilter(team)}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>

          <ul className="careers-roles__list reveal" id="careersList">
            {roles.map((r) => (
              <li
                className="careers-role"
                data-team={r.team}
                key={r.title}
                hidden={!(activeFilter === 'All' || r.team === activeFilter)}
              >
                <div className="careers-role__main">
                  <h3>{r.title}</h3>
                  <p>{r.summary}</p>
                </div>
                <ul className="careers-role__meta">
                  <li>{r.team}</li>
                  <li>{r.location}</li>
                  <li>{r.employmentType || 'Full-time'}</li>
                </ul>
                <button type="button" className="btn btn--primary careers-role__apply" onClick={() => goApply(r.title)}>
                  Apply <img src="/assets/icons/arrow-right.svg" alt="" />
                </button>
              </li>
            ))}
          </ul>

          <p className="careers-roles__empty" id="careersEmpty" hidden={shownCount > 0}>
            No open roles in this team right now. Send us a general application below.
          </p>
        </div>
      </section>

      <section className="careers-open">
        <div className="content-wrap">
          <div className="careers-open__banner reveal">
            <img src="/webimg/careers-leaf.webp" alt="" loading="lazy" decoding="async" />
            <div className="careers-open__card">
              <p className="careers-open__eyebrow">Don't see your role?</p>
              <h2 className="careers-open__title">We're always glad to meet people who care where food comes from.</h2>
              <div className="careers-open__actions">
                <a
                  href="#apply"
                  className="btn btn--primary careers-open__cta"
                  onClick={(e) => {
                    e.preventDefault();
                    goApply('General application');
                  }}
                >
                  Send a general application <img src="/assets/icons/arrow-right.svg" alt="" />
                </a>
                <a href="mailto:info@truleaf.in" className="careers-open__mail">
                  info@truleaf.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="careers-apply" id="apply">
        <div className="content-wrap careers-apply__grid">
          <div className="careers-apply__copy reveal">
            <p className="supply-eyebrow">APPLY</p>
            <h2 className="supply-heading">Tell us about yourself.</h2>
            <p className="careers-apply__body">
              Share a few details and your resume. A member of our team will read every application and reply within a
              week.
            </p>
            <ol className="careers-apply__steps">
              <li>
                <span>01</span>We review your application.
              </li>
              <li>
                <span>02</span>A short intro call with our team.
              </li>
              <li>
                <span>03</span>A practical conversation, then an offer.
              </li>
            </ol>
          </div>

          <div className="contact-card careers-apply__card reveal">
            <form
              className="contact-card__panel careers-form"
              id="careersForm"
              noValidate
              ref={formRef}
              onSubmit={onSubmit}
              hidden={successName !== null}
            >
              <p className="contact-card__title">Application form</p>
              <input
                type="text"
                name="website"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px' }}
              />

              <div className="contact-field">
                <label htmlFor="careerName">Full name</label>
                <input type="text" id="careerName" name="name" placeholder="Jane Doe" required autoComplete="name" />
              </div>

              <div className="contact-field" id="careerEmailField">
                <label htmlFor="careerEmail">Email</label>
                <input
                  type="email"
                  id="careerEmail"
                  name="email"
                  placeholder="jane@email.com"
                  required
                  autoComplete="email"
                  ref={emailRef}
                  onInput={() => setEmailError(false)}
                />
                <span className="careers-error" id="careerEmailError" hidden={!emailError}>
                  Please enter a valid email address.
                </span>
              </div>

              <div className="contact-field">
                <label htmlFor="careerPhone">Phone</label>
                <input type="tel" id="careerPhone" name="phone" placeholder="555 123 4567" autoComplete="tel" />
              </div>

              <div className="contact-field">
                <label htmlFor="careerLink">LinkedIn or portfolio</label>
                <input type="url" id="careerLink" name="link" placeholder="https://" />
              </div>

              <div className="contact-field careers-form__full">
                <label htmlFor="careerRole">Role you're applying for</label>
                <select id="careerRole" name="role" required value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="General application">General application</option>
                  {roles.map((r) => (
                    <option key={r.title} value={r.title}>
                      {r.title}
                    </option>
                  ))}
                  </select>
              </div>

              <div className="contact-field careers-form__full" id="careerResumeField">
                <label htmlFor="careerResume">Resume</label>
                <label className="careers-upload" htmlFor="careerResume">
                  <input
                    type="file"
                    id="careerResume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    required
                    ref={fileRef}
                    onChange={onFileChange}
                  />
                  <span className="careers-upload__text">
                    <b>Choose a file</b> <i id="careerFileName">{fileName}</i>
                  </span>
                </label>
                <span className="careers-error" id="careerResumeError" hidden={!fileError}>
                  Please attach a PDF, DOC or DOCX under 5 MB.
                </span>
              </div>

              <div className="contact-field careers-form__full">
                <label htmlFor="careerNote">
                  Why Trueleaf? <span className="careers-optional">(optional)</span>
                </label>
                <textarea
                  id="careerNote"
                  name="note"
                  placeholder="Tell us a bit about you and what draws you to this role..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn--primary contact-card__submit careers-form__full"
                id="careerSubmit"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit application'}
              </button>
            </form>

            <div
              className="contact-card__panel contact-card__panel--state"
              id="careerSuccess"
              hidden={successName === null}
            >
              <div className="contact-card__icon contact-card__icon--success">
                <img src="/assets/icons/state-success.svg" alt="" />
              </div>
              <p className="contact-card__title">Application received</p>
              <p className="careers-success__body">
                Thank you, <b id="careerSuccessName">{successName}</b>. We'll review your application and reply within a
                week.
              </p>
              <button type="button" className="btn btn--outline" id="careerAnother" onClick={sendAnother}>
                Submit another application
              </button>
            </div>
          </div>
        </div>
      </section>

      </main>


      <Footer />
    </>
  );
}
