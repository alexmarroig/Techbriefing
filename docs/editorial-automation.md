# Rotina Editorial Automatizada

Este runbook descreve como o Tech Briefing transforma noticias e pautas de tecnologia em artigos locais, com score editorial, imagem propria, SEO, AIO e leitura por LLMs.

## Objetivo

Publicar ate 10 artigos por dia sem copiar blogs, sem usar comentarios falsos e sem depender de publicacao direta no Sanity. A fonte de verdade para indexacao fica em `src/content/articles`, para que Astro gere sitemap, paginas `.txt` por artigo e `llms-full.txt`.

## Fontes e Pesquisa

1. Coletar RSS e sinais publicos ja configurados em `scripts/lib/feed-sources.mjs`.
2. Coletar Hacker News pela API publica quando disponivel.
3. Misturar candidatos evergreen da fila de keywords em `scripts/editorial-pipeline.mjs`.
4. Normalizar URLs removendo UTMs e hashes.
5. Rejeitar dominios de ruido, conteudo promocional e URLs ja cobertas.

Use scraping leve apenas para metadados publicos, como RSS, titulo, resumo e OG image. Nao copie corpo de materia protegida. Quando a pauta depender de uma fonte, cite o link original.

## Score Editorial

Cada candidato recebe pontuacao por:

- relevancia para agentes de IA, automacao, SEO/AIO, desenvolvimento, robotica, seguranca ou negocios;
- atualidade;
- sinal social quando existir;
- utilidade pratica para pequenos negocios, profissionais, criadores e freelancers;
- risco baixo de duplicar artigo, fonte ou titulo ja publicado.

Penalidades:

- conteudo promocional, cupons, descontos e posts patrocinados;
- falta de URL rastreavel;
- titulo muito parecido com artigo existente;
- fonte ja usada por artigo gerado automaticamente.

Comandos:

```bash
npm run editorial:dry-run -- --limit 10
npm run editorial:run -- --limit 10
npm run editorial:run -- --limit 1 --dry-run
```

## Estrutura do Artigo

Todo artigo gerado pela rotina deve conter:

- `sourceUrl`, `sourceName`, `editorialScore`, `canonicalKeyword`, `editorialType`;
- `image` local em `/images/news/{slug}.svg`;
- FAQ no frontmatter;
- 3 ou 4 `discussionPrompts` para comentarios reais;
- resposta rapida no inicio;
- fonte original no fim;
- analise propria, sem blocos longos copiados.

Estrutura recomendada:

1. Resposta rapida.
2. O que aconteceu.
3. Por que isso importa.
4. Como aplicar.
5. Riscos e limites.
6. Checklist SEO e AIO.
7. Perguntas para a comunidade.
8. Fonte.

## Imagens

A rotina prioriza imagem editorial propria:

- SVG em `public/images/news`;
- OG WebP em `public/images/og`;
- radar em `public/images/radar`.

Imagens remotas so devem ser usadas quando vierem de RSS/OG e forem permitidas como referencia externa. A rotina automatica usa SVG local por padrao para evitar reaproveitar asset protegido.

Comandos:

```bash
npm run curate:images -- --apply --skip-remote
npm run og:images
npm run audit:images
```

## SEO, AIO e LLM

Cada artigo deve:

- responder a pergunta principal no inicio;
- usar headings claros;
- citar fonte original quando houver noticia;
- incluir FAQ;
- ter descricao entre 80 e 280 caracteres;
- ter links internos quando fizer sentido;
- ser facil de resumir por LLMs.

Atualize `public/llms.txt` com:

```bash
npm run llms:index
```

O build gera sitemap e endpoints `.txt`:

```bash
npm run build
```

## Comentarios

Nao criar comentarios falsos. A rotina gera perguntas editoriais em `discussionPrompts`, exibidas antes do Giscus. O objetivo e estimular comentarios reais.

## Auditoria

Antes de publicar:

```bash
npm run test:editorial
npm run audit:editorial
npm run audit:images
npm run build
```

O auditor bloqueia:

- mojibake ou caracteres quebrados;
- imagem ausente ou quebrada;
- artigos automatizados sem fonte;
- artigos automatizados sem FAQ;
- artigos automatizados sem perguntas editoriais;
- texto curto demais;
- blocos longos citados de outra fonte;
- fonte duplicada entre artigos automatizados.

Use modo rigoroso em revisoes profundas:

```bash
npm run audit:editorial -- --strict-all
```

## Publicacao Automatica

O workflow `.github/workflows/daily-editorial-pipeline.yml` roda diariamente e:

1. instala dependencias;
2. roda `editorial:run` com limite 10;
3. regenera `llms.txt`;
4. gera OG images;
5. roda auditorias;
6. faz build;
7. commita e envia mudancas para `main`.

O ranking no Google nao e garantido. A rotina melhora consistencia tecnica, clareza, frequencia, estrutura e legibilidade por LLMs, mas ranking depende de concorrencia, autoridade, links, comportamento de usuario e tempo.
