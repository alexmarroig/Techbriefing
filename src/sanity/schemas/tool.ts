import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'tool',
  title: 'Ferramenta',
  type: 'document',
  icon: () => '🔧',
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
      options: { source: 'name', maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Ícone (emoji)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          'Automação', 'IA & LLMs', 'Produtividade', 'Sites & No-code',
          'Email & Newsletter', 'SEO & Analytics', 'Criação de Conteúdo',
          'Desenvolvimento', 'Formulários',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoryId',
      title: 'ID da categoria',
      type: 'string',
      description: 'Slug da categoria (ex: automacao, ia, produtividade)',
    }),
    defineField({
      name: 'rating',
      title: 'Avaliação',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'affiliate',
      title: 'Link de afiliado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Ordem',
      type: 'number',
      initialValue: 0,
      description: 'Ordem dentro da categoria (menor = primeiro)',
    }),
  ],
  orderings: [
    {
      title: 'Categoria / Ordem',
      name: 'categoryOrder',
      by: [
        { field: 'categoryId', direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      icon: 'icon',
    },
    prepare({ title, subtitle, icon }) {
      return {
        title: `${icon || ''} ${title}`,
        subtitle,
      }
    },
  },
})
