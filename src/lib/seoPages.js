// Single source of truth for each page's search title/description.
// Used by the pages (usePage) and by the build step that bakes real <head> tags into static HTML.
export const SITE = 'https://truleaf.in';

export const SEO = {
  '/': {
    title: 'Truleaf | Organic Fruit, Vegetable & Ingredient Exporter from India',
    description:
      'Traceable, certified organic fruits, vegetables and bulk ingredients, sourced direct from Indian farmer groups and shipped worldwide. Request a quote or sample.',
    h1: 'Organic fruit, vegetable and ingredient exporter from India',
  },
  '/about': {
    title: 'About Truleaf | Certified Organic Sourcing from India',
    description:
      'Meet Truleaf: how we build trust in organic sourcing through certified farmer partnerships, full traceability and transparent documentation.',
    h1: 'About Truleaf',
  },
  '/products-coconut': {
    title: 'Organic Coconut Products Exporter from India | Truleaf',
    description:
      'Organic coconut products sourced from certified Indian farms, supplied in export-grade volumes: coconut oil, desiccated coconut, coconut milk and more.',
    h1: 'Organic coconut products',
  },
  '/catalogue': {
    title: 'Product Catalogue | Organic Fruits, Vegetables & Ingredients | Truleaf',
    description:
      "Browse Truleaf's range of organic fresh and processed produce, ingredients and value-added products for global buyers.",
    h1: 'Product Catalogue',
  },
  '/ready-to-retail': {
    title: 'Ready to Retail | Private Label Food Manufacturing from India | Truleaf',
    description:
      'Turn your product idea into a shelf-ready pack. Truleaf handles sourcing, formulation, compliance and private-label production for pickles, beverages, snacks, ready-to-cook and ready-to-eat foods.',
    h1: "Got a product idea? We'll make it retail-ready.",
  },
  '/blog': {
    title: 'Blog | Organic Sourcing, Food Ingredients & Export Insights | Truleaf',
    description:
      'Insights on organic sourcing, clean-label ingredients, food safety, compliance and export logistics from the Truleaf team.',
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
    title: 'Contact Us | Request a Quote or Sample | Truleaf',
    description: 'Talk to the Truleaf sourcing team. Request a quote or sample for organic produce and ingredients.',
    h1: "Let's talk sourcing.",
  },
  '/privacy-policy': {
    title: 'Privacy & Cookie Policy | Truleaf',
    description:
      'How Truleaf Foods Private Limited collects, uses, stores, shares and protects personal data, and how we use cookies on truleaf.in.',
    h1: 'Privacy & Cookie Policy',
  },
};
