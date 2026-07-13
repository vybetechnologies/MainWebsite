import { defineField, defineType } from 'sanity';

export const CATEGORIES = [
  { title: 'Press Release', value: 'press-release' },
  { title: 'Product Announcement', value: 'product-announcement' },
  { title: 'Company News', value: 'company-news' },
  { title: 'Community Initiative', value: 'community-initiative' },
];

export const newsArticle = defineType({
  name: 'newsArticle',
  title: 'News Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: CATEGORIES,
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'Short teaser shown on the newsroom listing and homepage preview cards.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string' })],
        },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'mainImage' },
  },
});
