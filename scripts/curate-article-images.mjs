import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { renderRadarCover } from './lib/render-cover.mjs';
import {
  extractSourceFromMarkdown,
  isLocalImagePath,
  isUnsplashUrl,
  localImageExists,
  newsSvgPath,
  radarSvgPath,
  resolveArticleImage,
  shouldReplaceImage,
} from './lib/resolve-image.mjs';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');
const PUBLIC_DIR = path.join(ROOT, 'public');

function parseArgs(argv) {
  return {
    apply: argv.includes('--apply'),
    slug: argv.find((arg, index) => argv[index - 1] === '--slug'),
    limit: Number(argv.find((arg, index) => argv[index - 1] === '--limit') || 0) || Infinity,
    skipRemote: argv.includes('--skip-remote'),
  };
}

function updateFrontmatterImage(content, newImage) {
  if (/^image:\s/m.test(content)) {
    return content.replace(/^image:\s*.+$/m, `image: "${newImage}"`);
  }

  const lines = content.split('\n');
  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (closingIndex === -1) return content;

  lines.splice(closingIndex, 0, `image: "${newImage}"`);
  return lines.join('\n');
}

function isRadarArticle(slug, category) {
  return slug.startsWith('radar-tech-') || String(category).toLowerCase() === 'radar tech';
}

async function curateArticle(filePath, options) {
  const raw = await readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = path.basename(filePath, '.md');
  const title = data.title || slug;
  const category = data.category || '';
  const currentImage = data.image || '';
  const sourceUrl = extractSourceFromMarkdown(content);
  const radar = isRadarArticle(slug, category);

  if (radar) {
    const dateMatch = slug.match(/radar-tech-(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const dateIso = dateMatch[1];
      const radarPath = radarSvgPath(dateIso);
      const radarFile = path.join(PUBLIC_DIR, radarPath.replace(/^\//, ''));
      const newsRadarFile = path.join(PUBLIC_DIR, 'images', 'news', `radar-tech-${dateIso}.svg`);

      if (!existsSync(radarFile)) {
        if (existsSync(newsRadarFile) && options.apply) {
          await mkdir(path.dirname(radarFile), { recursive: true });
          await copyFile(newsRadarFile, radarFile);
        } else if (options.apply) {
          await mkdir(path.dirname(radarFile), { recursive: true });
          await writeFile(
            radarFile,
            renderRadarCover({ title, dateLabel: dateIso, items: [] }),
            'utf8',
          );
        }
      }

      if (existsSync(radarFile) && currentImage !== radarPath) {
        return {
          slug,
          changed: true,
          oldImage: currentImage,
          newImage: radarPath,
          origin: existsSync(newsRadarFile) ? 'promoted-radar' : 'generated-radar',
          content: updateFrontmatterImage(raw, radarPath),
        };
      }
    }
  }

  const needsReplace =
    !currentImage ||
    isUnsplashUrl(currentImage) ||
    shouldReplaceImage(currentImage, slug) ||
    (isLocalImagePath(currentImage) && !localImageExists(currentImage));

  const expectedNews = newsSvgPath(slug);
  if (!needsReplace && currentImage === expectedNews) {
    return { slug, changed: false };
  }

  if (!needsReplace && localImageExists(currentImage)) {
    return { slug, changed: false };
  }

  const resolved = await resolveArticleImage({
    slug,
    title,
    category,
    image: currentImage,
    sourceUrl,
    variant: radar ? 'radar' : 'news',
    apply: options.apply,
    preferRemote: !options.skipRemote && !radar,
  });

  if (!resolved?.path || resolved.path === currentImage) {
    return { slug, changed: false, origin: resolved?.origin };
  }

  return {
    slug,
    changed: true,
    oldImage: currentImage || '(none)',
    newImage: resolved.path,
    origin: resolved.origin,
    content: updateFrontmatterImage(raw, resolved.path),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const files = (await readdir(ARTICLES_DIR))
    .filter((file) => file.endsWith('.md'))
    .sort();

  const selected = options.slug
    ? files.filter((file) => file.replace(/\.md$/, '') === options.slug)
    : files.slice(0, options.limit);

  if (selected.length === 0) {
    throw new Error('Nenhum artigo encontrado para curadoria.');
  }

  const changes = [];
  let unchanged = 0;

  for (const file of selected) {
    const result = await curateArticle(path.join(ARTICLES_DIR, file), options);
    if (result.changed) {
      changes.push(result);
      if (options.apply && result.content) {
        await writeFile(path.join(ARTICLES_DIR, file), result.content, 'utf8');
      }
    } else {
      unchanged += 1;
    }
  }

  console.log(`[curate:images] mode=${options.apply ? 'apply' : 'dry-run'} articles=${selected.length}`);
  console.log(`[curate:images] changed=${changes.length} unchanged=${unchanged}`);

  for (const change of changes) {
    console.log(`- ${change.slug}: ${change.oldImage} -> ${change.newImage} (${change.origin})`);
  }

  if (!options.apply && changes.length > 0) {
    console.log('[curate:images] Rode com --apply para gravar as alterações.');
  }
}

main().catch((error) => {
  console.error(`[curate:images] ${error.message}`);
  process.exit(1);
});
