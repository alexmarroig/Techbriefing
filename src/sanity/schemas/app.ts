import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'app',
  title: 'App',
  type: 'document',
  icon: () => '📱',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Ícone (emoji)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['Disponível', 'Em beta', 'Coming soon'],
      },
    }),
    defineField({
      name: 'platform',
      title: 'Plataformas',
      type: 'string',
      description: 'Ex: "iOS · Android", "Web", "macOS"',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'status', icon: 'icon' },
    prepare({ title, subtitle, icon }) {
      return { title: `${icon || ''} ${title}`, subtitle }
    },
  },
})
