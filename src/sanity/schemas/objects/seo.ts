import { defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      type: 'string',
      title: 'Título SEO',
      description: 'Deixe vazio para usar o título principal',
    },
    {
      name: 'metaDescription',
      type: 'text',
      title: 'Descrição SEO',
      rows: 2,
      description: 'Deixe vazio para usar a descrição principal',
    },
    {
      name: 'ogImage',
      type: 'image',
      title: 'Imagem OG',
      description: 'Imagem para compartilhamento (1200x630). Deixe vazio para usar a imagem principal.',
    },
    {
      name: 'noIndex',
      type: 'boolean',
      title: 'Não indexar',
      initialValue: false,
      description: 'Marque para esconder esta página dos motores de busca',
    },
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
})
