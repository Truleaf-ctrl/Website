import { defineField, defineType } from 'sanity'

// One-off document that controls the two product sections on the home page.
// Editors pick items from a searchable dropdown; the order of the list is the order on the site.
export default defineType({
  name: 'homeFeatured',
  title: 'Home page: featured items',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredCategories',
      title: 'Featured Categories',
      description: 'Choose up to 4 categories to show in "Featured Categories". Drag to change the order.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
          options: { disableNew: true },
        },
      ],
      validation: (Rule) => Rule.max(4).unique(),
    }),
    defineField({
      name: 'trendingProducts',
      title: 'Trending Products',
      description: 'Choose up to 4 products to show in "Our Trending Products". Drag to change the order.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
          options: { disableNew: true },
        },
      ],
      validation: (Rule) => Rule.max(4).unique(),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home page: featured items' }),
  },
})
