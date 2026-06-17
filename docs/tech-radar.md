# Tech Radar automation

Use this command to create a Portuguese editorial roundup from Hacker News and major technology RSS feeds:

```bash
npm run radar:tech
```

The command writes a Markdown post to `src/content/articles/radar-tech-YYYY-MM-DD.md`.

Default behavior:

- Fetches Hacker News top stories through the official Firebase API.
- Fetches RSS feeds from technology and AI publishers.
- Scores items by relevance to AI, agents, automation, software and digital business.
- Generates a Portuguese analysis-style article with original source links.
- Refuses to overwrite an existing daily radar unless `RADAR_OVERWRITE=1` is set.

Optional environment variables:

- `RADAR_MAX_ITEMS=12`
- `RADAR_HN_LIMIT=35`
- `RADAR_OVERWRITE=1`

The generated post is intended for human review before publishing. It summarizes and comments on sources instead of copying articles.

## Fully automatic publishing

The repository includes `.github/workflows/daily-tech-radar.yml`.

It runs every day at 08:00 Sao Paulo time, using GitHub Actions, and can also be started manually from GitHub's Actions tab.

The workflow:

1. Installs dependencies with `npm ci`.
2. Runs `npm run radar:tech`.
3. Generates a daily SVG cover in `public/images/radar/radar-tech-YYYY-MM-DD.svg`.
4. Builds the site with `npm run build`.
5. Commits the new daily radar post and radar image.
6. Pushes to `main`, which lets Vercel deploy normally.

It does not overwrite an existing daily radar post. If the post already exists, the workflow exits without creating a duplicate.

## Image curation

- Radar posts always use an editorial SVG cover stored in `public/images/radar/`.
- RSS items now capture `imageUrl` when the feed exposes media thumbnails.
- For individual articles, run:

```bash
npm run curate:images
npm run curate:images -- --apply
npm run curate:images -- --apply --skip-remote
npm run audit:images
```

The curation script tries RSS/OG images first for news articles, then falls back to branded SVG covers in `public/images/news/`.

## GitHub Actions (automação)

| Workflow | Quando | O que faz |
|----------|--------|-----------|
| `daily-tech-radar.yml` | Diário 11h SP + manual | Gera radar, roda `curate:images` na capa do dia, `audit:images`, build e commit |
| `daily-news-article.yml` | Diário 15h SP + manual | Gera **1 artigo avulso** da notícia mais relevante ainda não coberta, curadoria de capa (RSS/OG + SVG), audit e commit |
| `weekly-image-maintenance.yml` | Domingo 10h SP + manual | Audita e re-curadoriza **todos** os artigos (`--skip-remote` por padrão; opção manual para RSS/OG) |
| `pr-image-audit.yml` | Em PRs que mexem em artigos/imagens | Falha o PR se algum `image:` estiver quebrado ou for Unsplash |

### Artigo avulso (`news:article`)

```bash
npm run news:article
```

Comportamento:

- Busca RSS + Hacker News (mesmas fontes do radar).
- Ignora URLs já usadas em artigos existentes e no radar do dia.
- Pula os 5 primeiros itens do ranking (reservados ao radar da manhã).
- Gera Markdown em `src/content/articles/{slug}.md` com análise em português.
- Resolve capa: imagem do feed ou OG, com fallback para SVG editorial em `public/images/news/`.

Variáveis opcionais:

- `NEWS_SKIP_RADAR_TOP=5` — quantos itens do topo ignorar para não duplicar o radar.
- `NEWS_SKIP_REMOTE=1` — não tentar RSS/OG; só SVG editorial.
- `NEWS_OVERWRITE=1` — sobrescrever artigo se o slug já existir.

### OG WebP (`og:images`)

```bash
npm run og:images
npm run og:images -- --slug meu-artigo
```

Gera `public/images/og/{slug}.webp` (1200×630) a partir de capas SVG locais e `public/assets/og-default.webp` para meta tags sociais. Artigos com capa remota (URL http) continuam usando a URL original no OG.

### Sync Sanity (`sync:sanity-images`)

```bash
npm run sync:sanity-images              # dry-run
npm run sync:sanity-images -- --apply   # upload incremental
```

Envia apenas imagens novas em `public/images/{news,radar,editorial,og}` para o CDN do Sanity e atualiza [`scripts/image-mapping.json`](scripts/image-mapping.json).

Secrets no GitHub (para o workflow semanal):

- `SANITY_WRITE_TOKEN`
- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET` (opcional, default `production`)

### Disparar manualmente

1. GitHub → **Actions** → escolha o workflow → **Run workflow**.
2. Em **Weekly Image Maintenance**, marque *Tentar imagens RSS/OG* se quiser buscar capas reais das fontes (mais lento, pode levar vários minutos).

### Próximos workflows (ideias)

- Pipeline de republicação Markdown → documentos Sanity com capas sincronizadas.
