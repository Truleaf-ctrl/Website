import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'job',
  title: 'Job listing',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'string',
      options: {
        layout: 'dropdown',
        list: ['Sourcing', 'Quality', 'R&D', 'Operations', 'Marketing'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: 'e.g. Coimbatore, India or Remote, India',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      options: {
        layout: 'dropdown',
        list: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      },
      initialValue: 'Full-time',
    }),
    defineField({
      name: 'summary',
      title: 'Short description',
      description: 'One or two sentences shown on the listing.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: 'active',
      title: 'Show on website',
      description: 'Switch off when the role is filled. The listing is hidden but not deleted.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers show first',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'title', team: 'team', location: 'location', active: 'active' },
    prepare: ({ title, team, location, active }) => ({
      title,
      subtitle: `${active === false ? 'Hidden · ' : ''}${[team, location].filter(Boolean).join(' · ')}`,
    }),
  },
})
