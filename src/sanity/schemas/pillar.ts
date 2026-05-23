import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pillar',
  title: 'Página Pilar',
  type: 'document',
  icon: () => '🏛️',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      description: 'Texto curto acima do título',
    }),
    defineField({
      name: 'sections',
      title: 'Seções',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', type: 'string', title: 'Título' },
            { name: 'body', type: 'text', title: 'Texto' },
          ],
          preview: {
            select: { title: 'heading' },
          },
        },
      ],
    }),
    defineField({
      name: 'links',
      title: 'Links relacionados',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Texto' },
            { name: 'href', type: 'string', title: 'URL' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
