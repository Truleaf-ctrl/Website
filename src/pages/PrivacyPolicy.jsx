import Nav from '../components/Nav';
import Footer from '../components/Footer';
import usePage from '../hooks/usePage';
import useReveal from '../hooks/useReveal';
import useMotion from '../hooks/useMotion';
import { SITE_CSS } from '../styles/site';
import { SEO } from '../lib/seoPages';

const LAST_UPDATED = '10 November 2026';

const INTRO = [
  'Truleaf Foods Private Limited (“Truleaf”, “we”, “us” or “our”) respects your privacy and is committed to handling personal information responsibly. This Privacy & Cookie Policy explains how we collect, receive, use, store, disclose and protect personal data when you visit our website, contact us, request information, enquire about our products or services, or otherwise interact with our business.',
  'This policy is intended for visitors and users of https://www.truleaf.in and individuals who communicate with Truleaf in connection with its food products, sourcing, domestic and international trade, export/import activities, business enquiries, supplier relationships, consultancy or other services.',
  'This policy is prepared with reference to applicable Indian privacy and information technology laws, including the Digital Personal Data Protection Act, 2023 (“DPDP Act”) and the Digital Personal Data Protection Rules, 2025, to the extent and from the dates their provisions are brought into force. It should be read together with any specific notice provided at the point of data collection. For privacy-related questions or requests, please contact us using the details in the “Contact us” section.',
];

// Each block: { p } paragraph, { ul } bullet list (strings or [lead, rest]), { h } sub-heading.
const SECTIONS = [
  {
    title: 'What personal data do we collect and process?',
    blocks: [
      { p: 'Depending on how you interact with us, the personal data we may collect includes:' },
      {
        ul: [
          'Identity and professional details, such as your name, designation, job title, employer or organisation, and business relationship with Truleaf.',
          'Contact details, such as business or postal address, email address, telephone number and other contact information you choose to provide.',
          'Enquiry and communication details, including the content of messages, requests, feedback, meeting records and correspondence sent through website forms, email, telephone or other channels.',
          'Business and transaction information, such as purchase or sales enquiries, product interests, specifications, quotations, contracts, purchase orders, delivery details, billing information and payment-related records.',
          'Supplier, customer and business-partner information needed for onboarding, due diligence, verification, contract management, trade compliance and business operations.',
          'Recruitment information voluntarily provided by job applicants, such as CV/resume, employment history, qualifications, skills, references and contact details.',
          'Website and technical information, such as IP address, browser type, device information, operating system, pages viewed, referring page, approximate location derived from technical data, visit date/time and website interaction information, where collected by our website or service providers.',
          'Information required to meet legal, regulatory, audit, tax, accounting, food-safety, trade or record-keeping obligations.',
        ],
      },
      {
        p: 'Please do not submit sensitive personal information through the website unless it is specifically requested and there is a lawful and necessary reason to provide it.',
      },
    ],
  },
  {
    title: 'How do we collect your personal data?',
    blocks: [
      { p: 'We may collect personal data through one or more of the following methods:' },
      {
        ul: [
          'When you submit an enquiry, contact form, request-for-quotation form or other form on our website.',
          'When you contact us directly by email, telephone, messaging service, post or in person.',
          'When you request information about our products, services, sourcing capabilities, exports, imports or business opportunities.',
          'When you enter into or discuss a contract, purchase, sale, supply, consultancy or other business arrangement with us.',
          'When you subscribe to company updates or marketing communications, if such subscription facility is offered.',
          'When you apply for employment, internship or another opportunity with Truleaf.',
          'When your organisation or an authorised representative shares your business contact details with us.',
          'From publicly available business sources, such as company websites, trade directories, professional networks, public registers and other lawful sources, for legitimate business-to-business purposes.',
          'Automatically through website logs, cookies and similar technologies, depending on the website tools and settings actually enabled.',
        ],
      },
    ],
  },
  {
    title: 'Why do we collect and use your personal data?',
    blocks: [
      { p: 'We may use personal data for purposes relevant to our business, including:' },
      {
        ul: [
          'To respond to enquiries, requests, complaints and feedback.',
          'To provide information about our products, food ingredients, processed fruits and vegetables, coconut products, trading activities and services.',
          'To prepare quotations, proposals, product specifications and commercial communications.',
          'To establish, negotiate, perform and manage contracts and business relationships.',
          'To coordinate sourcing, supplier verification, orders, logistics, delivery, documentation and customer support.',
          'To process invoices, payments, accounting, taxation and other financial administration.',
          'To conduct appropriate supplier, customer, agent, broker and business-partner due diligence and trade-compliance checks.',
          'To manage recruitment, evaluate applications and communicate with applicants.',
          'To send newsletters, product updates or marketing communications where permitted by applicable law and, where required, with your consent. You may opt out of marketing communications at any time.',
          'To operate, maintain, secure and improve our website, understand website usage and troubleshoot technical issues.',
          'To protect our rights, property, personnel, customers and business operations; prevent fraud or misuse; and handle disputes or legal claims.',
          'To comply with applicable laws, regulatory requirements, lawful requests and audit or record-retention obligations.',
        ],
      },
    ],
  },
  {
    title: 'Legal basis / permitted grounds for processing',
    blocks: [
      {
        p: 'We will process personal data only where there is an applicable legal basis or permitted ground under the law in force. Depending on the context and the commencement of relevant provisions, this may include:',
      },
      {
        ul: [
          'Your consent, where consent is required or relied upon.',
          'Taking steps at your request before entering into a contract, or performing a contract with you or your organisation.',
          'Compliance with legal obligations, including tax, accounting, regulatory, trade and record-retention requirements.',
          'Other uses or permitted grounds recognised under applicable Indian law, where the relevant provisions are in force.',
        ],
      },
      {
        p: 'Where consent is relied upon, you may withdraw it through the method specified in the relevant notice or by contacting us. Withdrawal will not affect processing already lawfully carried out before withdrawal, and we may continue to retain or process information where another lawful ground or legal obligation applies.',
      },
    ],
  },
  {
    title: 'Cookies and website analytics',
    blocks: [
      {
        p: 'Cookies are small text files or similar technologies that may be stored on your device when you visit a website. They can help a website function, remember preferences, understand website performance and, where enabled, support analytics or marketing.',
      },
      { h: '5.1 Types of cookies that may be used' },
      {
        ul: [
          ['Strictly necessary cookies:', ' These support core website functions, security, navigation, form submission or remembering privacy choices. They are generally required for the website to operate.'],
          ['Preference or functionality cookies:', ' These may remember choices such as language, region or other website preferences.'],
          ['Analytics or performance cookies:', ' If enabled, these help us understand aggregated website usage, such as pages visited, time spent and navigation patterns, so that we can improve the website.'],
          ['Marketing or social-media cookies:', ' If enabled, these may be set by advertising, social-media or embedded-content providers to measure campaigns or provide relevant content.'],
        ],
      },
      { h: '5.2 Cookie choices and controls' },
      {
        p: 'Where the website uses non-essential cookies or similar technologies requiring consent, we will provide an appropriate notice and choice mechanism before those technologies are activated, as required by applicable law. You may also manage or delete cookies through your browser settings. Blocking certain cookies may affect some website functions. The exact cookies, providers, purposes and retention periods depend on the website configuration and third-party services actually installed. Truleaf should maintain an up-to-date cookie inventory and configure its cookie banner or consent-management tool to match the technologies in use. This policy does not represent that Google Analytics, LinkedIn Insight Tag, Meta Pixel, HubSpot or any other specific tracker is currently installed.',
      },
    ],
  },
  {
    title: 'Who may we share your personal data with?',
    blocks: [
      {
        p: 'We do not sell personal data as a standalone business activity. We may share personal data where necessary and proportionate for the purposes described in this policy, including with:',
      },
      {
        ul: [
          'Service providers supporting our website hosting, website maintenance, email, IT systems, cybersecurity, cloud storage, customer relationship management, communications or business administration.',
          'Professional advisers, auditors, consultants, insurers, banks, payment service providers and financial institutions, where relevant.',
          'Suppliers, manufacturers, processors, warehouses, logistics providers, customs brokers, freight forwarders, agents and business partners, where information is necessary to respond to an enquiry, perform a transaction or provide a requested service.',
          'Government authorities, regulators, courts, law-enforcement agencies, customs authorities and other public bodies where disclosure is required or permitted by law.',
          'Other parties involved in a business reorganisation, merger, acquisition or transfer, subject to appropriate confidentiality and legal safeguards.',
        ],
      },
      {
        p: 'We aim to share only the information reasonably necessary for the relevant purpose. Where third-party service providers process personal data on our behalf, we expect them to protect it and use it only for authorised purposes, subject to applicable law and contractual arrangements.',
      },
    ],
  },
  {
    title: 'Third-party service providers and external links',
    blocks: [
      {
        p: 'Our website or business operations may use third-party service providers for hosting, email, analytics, forms, customer relationship management, social-media features or other functions. The providers actually used may change over time. Their processing of personal data may be governed by their own privacy policies and contractual terms.',
      },
      {
        p: 'Our website may contain links to third-party websites, including professional networks, service providers, certification bodies, government portals or business partners. Those websites are not controlled by Truleaf. Their privacy and cookie practices are governed by their own policies, and we encourage you to review them before providing personal data.',
      },
    ],
  },
  {
    title: 'How long do we retain your personal data?',
    blocks: [
      {
        p: 'We retain personal data only for as long as reasonably necessary for the purpose for which it was collected, including to respond to enquiries, perform contracts, manage business relationships, meet legal and regulatory obligations, resolve disputes and protect legitimate business interests.',
      },
      {
        p: 'Retention periods may vary depending on the category of information and the applicable requirements. For example, transaction, invoice, tax, customs and accounting records may need to be retained for statutory periods. Recruitment records may be retained for a reasonable period for recruitment administration and legal purposes. Website logs and analytics data may be retained according to system settings and operational needs.',
      },
      {
        p: 'When personal data is no longer required, we will take reasonable steps to delete it, anonymise it or securely dispose of it, unless retention is required or permitted by law.',
      },
    ],
  },
  {
    title: 'How do we protect your personal data?',
    blocks: [
      {
        p: 'We use reasonable technical and organisational measures appropriate to the nature of the information and the risks involved to protect personal data against unauthorised access, disclosure, alteration, loss, misuse or destruction. Measures may include access controls, password protection, secure hosting, backups, staff awareness, restricted access and service-provider controls.',
      },
      {
        p: 'No website, email transmission or electronic storage system can be guaranteed to be completely secure. If you believe that information you have provided to us has been compromised, please contact us promptly using the details below.',
      },
    ],
  },
  {
    title: 'Your privacy rights and choices',
    blocks: [
      {
        p: 'Depending on the applicable law and the date on which relevant provisions come into force, you may have rights in relation to your personal data. These may include:',
      },
      {
        ul: [
          'Requesting information about personal data processed by us and the purposes of processing.',
          'Requesting correction or updating of inaccurate or incomplete personal data.',
          'Requesting erasure of personal data where the law provides that right and retention is not required by law.',
          'Withdrawing consent where processing is based on consent.',
          'Raising a grievance or privacy concern through the contact channel provided below.',
          'Exercising any other rights available under applicable Indian data protection law.',
        ],
      },
      {
        p: 'Requests will be handled in accordance with the applicable law, identity-verification requirements and any lawful exceptions. We may need to retain certain information to comply with legal obligations or establish, exercise or defend legal claims.',
      },
      {
        p: 'The DPDP Act, 2023 and DPDP Rules, 2025 have a phased commencement schedule; the statutory rights and obligations will apply from their respective notified commencement dates.',
      },
    ],
  },
  {
    title: 'Children’s personal data',
    blocks: [
      {
        p: 'Our website and business services are intended primarily for businesses and adults acting in a professional capacity. We do not knowingly seek to collect personal data from children through the website for marketing or commercial profiling. If we become aware that personal data of a child has been collected in a manner contrary to applicable law, we will take appropriate steps in accordance with the law.',
      },
    ],
  },
  {
    title: 'Marketing communications',
    blocks: [
      {
        p: 'If you request or subscribe to receive company news, product updates or marketing communications, we may use your contact details to send those communications in accordance with applicable law and your preferences. You may opt out at any time by using an unsubscribe facility where available or by contacting us. Opting out of marketing will not prevent us from sending necessary transactional, contractual, service or legal communications.',
      },
    ],
  },
  {
    title: 'Changes to this Privacy & Cookie Policy',
    blocks: [
      {
        p: 'We may update this policy from time to time to reflect changes in our business, website features, service providers, technologies or applicable laws. The revised version will be published on this page with an updated “Last updated” date. Where required by law, we will provide additional notice or seek consent for material changes.',
      },
    ],
  },
];

const CONTACT = [
  ['Company name', 'Truleaf Foods Private Limited'],
  ['Website', 'https://www.truleaf.in'],
  ['Registered / business address', '1A-1B Neem Square, KRG Nagar Main Street, Ganapathy, Coimbatore, Tamil Nadu, India 641006'],
  ['Privacy contact email', 'info@truleaf.in'],
];

export default function PrivacyPolicy() {
  usePage({
    title: SEO['/privacy-policy'].title,
    description: SEO['/privacy-policy'].description,
    path: '/privacy-policy',
    css: SITE_CSS,
  });
  useReveal();
  useMotion();

  const contactNo = SECTIONS.length + 1;

  return (
    <>
      <header className="company-hero company-hero--doc">
        <Nav />
        <div className="company-hero__content content-wrap reveal">
          <p className="company-eyebrow">Our Code &amp; Policies</p>
          <h1 className="company-hero__title">Privacy &amp; Cookie Policy</h1>
          <p className="company-hero__body">
            Truleaf Foods Private Limited · Last updated: {LAST_UPDATED}
          </p>
        </div>
      </header>

      <main id="main">

      <section className="legal">
        <div className="content-wrap legal__layout">
          <nav className="legal__toc" aria-label="Contents">
            <p className="legal__toc-title">Contents</p>
            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s${i + 1}`}>{s.title}</a>
                </li>
              ))}
              <li>
                <a href={`#s${contactNo}`}>Contact us</a>
              </li>
            </ol>
          </nav>

          <article className="legal__body">
            <div className="legal__intro">
              {INTRO.map((t) => (
                <p key={t.slice(0, 24)}>{t}</p>
              ))}
            </div>

            {SECTIONS.map((s, i) => (
              <section key={s.title} id={`s${i + 1}`} className="legal__section">
                <h2>
                  <span>{i + 1}.</span> {s.title}
                </h2>
                {s.blocks.map((b, j) => {
                  if (b.p) return <p key={j}>{b.p}</p>;
                  if (b.h) return <h3 key={j}>{b.h}</h3>;
                  return (
                    <ul key={j}>
                      {b.ul.map((li) =>
                        Array.isArray(li) ? (
                          <li key={li[0]}>
                            <strong>{li[0]}</strong>
                            {li[1]}
                          </li>
                        ) : (
                          <li key={li}>{li}</li>
                        ),
                      )}
                    </ul>
                  );
                })}
              </section>
            ))}

            <section id={`s${contactNo}`} className="legal__section">
              <h2>
                <span>{contactNo}.</span> Contact us
              </h2>
              <p>
                If you have any questions, concerns, requests or complaints relating to this Privacy &amp; Cookie
                Policy or the handling of your personal data, please contact:
              </p>
              <dl className="legal__contact">
                {CONTACT.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>
                      {k === 'Privacy contact email' ? (
                        <a href={`mailto:${v}`}>{v}</a>
                      ) : k === 'Website' ? (
                        <a href={v}>{v}</a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </article>
        </div>
      </section>

      </main>


      <Footer />
    </>
  );
}
