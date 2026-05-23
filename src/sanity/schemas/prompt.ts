import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'prompt',
  title: 'Prompt',
  type: 'document',
  icon: () => '💬',
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
      options: {
        list: [
          { title: 'Negócios', value: 'negocios' },
          { title: 'Agentes', value: 'agentes' },
          { title: 'Automação', value: 'automacao' },
          { title: 'Conteúdo', value: 'conteudo' },
          { title: 'Vídeo, imagem e voz', value: 'video-voz' },
          { title: 'Dados', value: 'dados' },
          { title: 'Design e produto', value: 'design-produto' },
          { title: 'Vendas e marketing', value: 'vendas-marketing' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'objective',
      title: 'Objetivo',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'whenToUse',
      title: 'Quando usar',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'prompt',
      title: 'Prompt',
      type: 'text',
      rows: 10,
      description: 'O texto completo do prompt',
    }),
    defineField({
      name: 'variations',
      title: 'Variações',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'nextSteps',
      title: 'Próximos passos',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
