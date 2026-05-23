import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'comparativo',
  title: 'Comparativo',
  type: 'document',
  icon: () => '⚔️',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
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
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      initialValue: 'Comparativo',
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      initialValue: 'Tech Briefing',
    }),
    defineField({
      name: 'date',
      title: 'Data de publicação',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Tempo de leitura',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Destaque',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Imagem principal',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Texto alternativo' },
      ],
    }),
    defineField({
      name: 'tools',
      title: 'Ferramentas comparadas',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'comparisonTable',
      title: 'Tabela comparativa',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'criteria', type: 'string', title: 'Critério' },
            {
              name: 'toolA',
              type: 'object',
              title: 'Ferramenta A',
              fields: [
                { name: 'value', type: 'string', title: 'Valor' },
                {
                  name: 'rating',
                  type: 'string',
                  title: 'Avaliação',
                  options: {
                    list: [
                      { title: '🟢 Bom', value: 'good' },
                      { title: '🟡 Médio', value: 'medium' },
                      { title: '🔴 Ruim', value: 'bad' },
                    ],
                  },
                },
              ],
            },
            {
              name: 'toolB',
              type: 'object',
              title: 'Ferramenta B',
              fields: [
                { name: 'value', type: 'string', title: 'Valor' },
                {
                  name: 'rating',
                  type: 'string',
                  title: 'Avaliação',
                  options: {
                    list: [
                      { title: '🟢 Bom', value: 'good' },
                      { title: '🟡 Médio', value: 'medium' },
                      { title: '🔴 Ruim', value: 'bad' },
                    ],
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'criteria' },
          },
        },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'Perguntas frequentes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Pergunta' },
            { name: 'answer', type: 'text', title: 'Resposta' },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Conteúdo',
      type: 'blockContent',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      tools: 'tools',
    },
    prepare({ title, media, tools }) {
      return {
        title,
        subtitle: tools ? tools.join(' vs ') : 'Comparativo',
        media,
      }
    },
  },
})
