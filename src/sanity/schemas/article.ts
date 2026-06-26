import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Artigo',
  type: 'document',
  icon: () => '📝',
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
      description: 'Resumo para SEO e cards (máx. 200 caracteres)',
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'IA Prática', value: 'IA Prática' },
          { title: 'Agentes de IA', value: 'Agentes de IA' },
          { title: 'Automação', value: 'Automação' },
          { title: 'Negócios', value: 'Negócios' },
          { title: 'Ferramentas', value: 'Ferramentas' },
          { title: 'Desenvolvimento', value: 'Desenvolvimento' },
          { title: 'Tendências', value: 'Tendências' },
          { title: 'Produtividade', value: 'Produtividade' },
        ],
      },
      validation: (Rule) => Rule.required(),
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
      description: 'Ex: "7 min"',
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
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'sourceUrl',
      title: 'URL da fonte original',
      type: 'url',
      description: 'Fonte usada pela rotina editorial automatizada.',
    }),
    defineField({
      name: 'sourceName',
      title: 'Nome da fonte',
      type: 'string',
    }),
    defineField({
      name: 'editorialScore',
      title: 'Score editorial',
      type: 'number',
      description: 'Pontuacao usada para priorizar publicacao automatica.',
    }),
    defineField({
      name: 'canonicalKeyword',
      title: 'Keyword canonica',
      type: 'string',
    }),
    defineField({
      name: 'editorialType',
      title: 'Tipo editorial',
      type: 'string',
      options: {
        list: [
          { title: 'Analise automatizada de noticia', value: 'automated-news-analysis' },
          { title: 'Guia evergreen', value: 'evergreen-guide' },
          { title: 'Editorial manual', value: 'manual-editorial' },
        ],
      },
    }),
    defineField({
      name: 'discussionPrompts',
      title: 'Perguntas para comentarios reais',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Perguntas editoriais exibidas antes do Giscus. Nao usar comentarios falsos.',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ (Schema)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', title: 'Pergunta', type: 'string' },
          { name: 'answer', title: 'Resposta', type: 'text' }
        ]
      }],
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
  orderings: [
    {
      title: 'Data (mais recente)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
      date: 'date',
    },
    prepare({ title, subtitle, media, date }) {
      const d = date ? new Date(date).toLocaleDateString('pt-BR') : ''
      return {
        title,
        subtitle: `${subtitle || ''} · ${d}`,
        media,
      }
    },
  },
})
