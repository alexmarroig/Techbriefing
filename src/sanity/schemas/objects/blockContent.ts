import { defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'blockContent',
  title: 'Conteúdo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Citação', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Negrito', value: 'strong' },
          { title: 'Itálico', value: 'em' },
          { title: 'Código', value: 'code' },
          { title: 'Sublinhado', value: 'underline' },
          { title: 'Riscado', value: 'strike-through' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule: any) =>
                  Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Abrir em nova aba',
                initialValue: false,
              },
            ],
          },
        ],
      },
      lists: [
        { title: 'Lista', value: 'bullet' },
        { title: 'Numerada', value: 'number' },
      ],
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Legenda',
        },
      ],
    }),
    defineArrayMember({
      type: 'code',
      options: {
        languageAlternatives: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'Python', value: 'python' },
          { title: 'Bash', value: 'bash' },
          { title: 'JSON', value: 'json' },
          { title: 'YAML', value: 'yaml' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'SQL', value: 'sql' },
          { title: 'Plain Text', value: 'text' },
        ],
      },
    }),
  ],
})
