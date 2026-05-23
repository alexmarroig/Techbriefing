import type { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Tech Briefing')
    .items([
      S.listItem()
        .title('Artigos')
        .schemaType('article')
        .child(
          S.documentTypeList('article')
            .title('Artigos')
            .defaultOrdering([{ field: 'date', direction: 'desc' }])
        ),
      S.listItem()
        .title('Comparativos')
        .schemaType('comparativo')
        .child(S.documentTypeList('comparativo').title('Comparativos')),
      S.divider(),
      S.listItem()
        .title('Ferramentas')
        .schemaType('tool')
        .child(S.documentTypeList('tool').title('Ferramentas')),
      S.listItem()
        .title('Ebooks')
        .schemaType('ebook')
        .child(S.documentTypeList('ebook').title('Ebooks')),
      S.listItem()
        .title('Apps')
        .schemaType('app')
        .child(S.documentTypeList('app').title('Apps')),
      S.divider(),
      S.listItem()
        .title('Prompts')
        .schemaType('prompt')
        .child(S.documentTypeList('prompt').title('Prompts')),
      S.listItem()
        .title('Manuais')
        .schemaType('manual')
        .child(S.documentTypeList('manual').title('Manuais')),
      S.listItem()
        .title('Páginas Pilar')
        .schemaType('pillar')
        .child(S.documentTypeList('pillar').title('Páginas Pilar')),
    ])
