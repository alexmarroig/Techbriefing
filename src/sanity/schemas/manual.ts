import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'manual',
  title: 'Manual',
  type: 'document',
  icon: () => '📖',
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
      name: 'category',
      title: 'Categoria',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'outcome',
      title: 'Resultado esperado',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'tools',
      title: 'Ferramentas necessárias',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'steps',
      title: 'Passos',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'mistakes',
      title: 'Erros comuns',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
