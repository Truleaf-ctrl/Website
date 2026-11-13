// Single source of truth for each page's search title/description.
// Used by the pages (usePage) and by the build step that bakes real <head> tags into static HTML.
export const SITE = 'https://truleaf.in';

export const SEO = {
  '/': {
    title: 'Organic Food Exporter India | Fruits & Vegetables | Truleaf',
    description:
      'Organic food exporter in India: traceable, certified organic fruits, vegetables, coconut products and bulk ingredients shipped worldwide. Request a quote.',
    h1: 'Organic fruit, vegetable and ingredient exporter from India',
  },
  '/about': {
    title: 'About Truleaf | Organic Exporter in Coimbatore, India',
    description:
      'Truleaf is a Coimbatore-based organic food exporter. We build trust through certified farmer partnerships, full traceability and transparent documentation.',
    h1: 'About Truleaf',
  },
  '/products-coconut': {
    title: 'Organic Coconut Exporter India | Oil & Desiccated | Truleaf',
    description:
      'Organic coconut oil, desiccated coconut, coconut butter and fresh coconut from certified Indian farms, supplied to importers in export-grade volumes.',
    h1: 'Organic coconut products',
  },
  '/catalogue': {
    title: 'Product Catalogue | Organic Ingredients India | Truleaf',
    description:
      'Browse our range: coconut products, cold-pressed oils, frozen fruits and vegetables, pickles, purees, spices, pulses, snacks and ready foods for global buyers.',
    h1: 'Product Catalogue',
  },
  '/ready-to-retail': {
    title: 'Private Label Food Manufacturer India | Truleaf',
    description:
      'Turn your idea into a shelf-ready pack. Private label manufacturing in India: sourcing, compliance and packing for pickles, beverages, snacks and ready foods.',
    h1: "Got a product idea? We'll make it retail-ready.",
  },
  '/blog': {
    title: 'Blog | Organic Sourcing & Clean-Label Ingredients | Truleaf',
    description:
      'Insights for food businesses on organic sourcing, clean-label ingredients, product development, food safety, compliance and export logistics.',
    h1: 'Our Blog',
  },
  '/careers': {
    title: 'Careers | Jobs in Sourcing, Quality & Export Operations | Truleaf',
    description: 'Join Truleaf and work across sourcing, quality, R&D and export operations. See open roles and apply.',
    h1: 'Build a career rooted in good food.',
  },
  '/company': {
    title: 'Company | Code of Conduct, Policies & Speak Up | Truleaf',
    description:
      'Our Code & Policies and Speak Up: the standards Truleaf holds itself to, and how to raise a concern safely.',
    h1: 'Doing business the way food should be grown: honestly.',
  },
  '/contact': {
    title: 'Contact Truleaf | Request a Quote or Sample',
    description: 'Talk to the Truleaf sourcing team in Coimbatore. Request a quote or sample for organic produce, coconut products and bulk ingredients.',
    h1: "Let's talk sourcing.",
  },
  '/privacy-policy': {
    title: 'Privacy & Cookie Policy | Truleaf',
    description:
      'How Truleaf Foods Private Limited collects, uses, stores, shares and protects personal data, and how we use cookies on truleaf.in.',
    h1: 'Privacy & Cookie Policy',
  },
};
