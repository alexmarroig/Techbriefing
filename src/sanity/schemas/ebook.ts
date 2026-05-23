import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ebook',
  title: 'Ebook',
  type: 'document',
  icon: () => '📚',
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
      name: 'price',
      title: 'Preço',
      type: 'string',
      description: 'Ex: "R$ 37"',
    }),
    defineField({
      name: 'oldPrice',
      title: 'Preço anterior',
      type: 'string',
      description: 'Preço riscado (deixe vazio se não houver)',
    }),
    defineField({
      name: 'pages',
      title: 'Páginas',
      type: 'number',
    }),
    defineField({
      name: 'color',
      title: 'Cor do tema',
      type: 'string',
      initialValue: 'amber',
      options: {
        list: ['amber', 'cyan', 'green', 'purple', 'red'],
      },
    }),
    defineField({
      name: 'benefits',
      title: 'Benefícios',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'url',
      title: 'URL da página',
      type: 'string',
    }),
    defineField({
      name: 'checkoutUrl',
      title: 'URL de checkout',
      type: 'url',
      description: 'Link do Kiwify ou plataforma de vendas',
    }),
    defineField({
      name: 'formats',
      title: 'Formatos',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'coverImage',
      title: 'Capa',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'toc',
      title: 'Sumário',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Títulos dos capítulos',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
      media: 'coverImage',
    },
  },
})
