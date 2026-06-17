/**
 * Gera WebP 1200x630 para Open Graph a partir de capas SVG locais.
 *
 * Uso:
 *   npm run og:images
 *   npm run og:images -- --slug meu-artigo
 *   npm run og:images -- --apply  (default: apply)
 */
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');
const OG_DIR = path.join(ROOT, 'public', 'images', 'og');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const slugFilter = (() => {
  const index = process.argv.indexOf('--slug');
  return index >= 0 ? process.argv[index + 1] : '';
})();

function publicPathToFile(publicPath) {
  return path.join(PUBLIC_DIR, publicPath.replace(/^\//, ''));
}

async function svgToOgWebp(sourcePath, outputPath) {
  await sharp(sourcePath, { density: 144 })
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toFile(outputPath);
}

async function ensureDefaultOgWebp() {
  const svgPath = path.join(PUBLIC_DIR, 'assets', 'og-default.svg');
  const webpPath = path.join(PUBLIC_DIR, 'assets', 'og-default.webp');
  if (!existsSync(svgPath)) return;

  await svgToOgWebp(svgPath, webpPath);
  console.log(`[og:images] default ${webpPath}`);
}

async function processArticle(fileName) {
  const slug = fileName.replace(/\.md$/, '');
  if (slugFilter && slug !== slugFilter) return null;

  const raw = readFileSync(path.join(ARTICLES_DIR, fileName), 'utf8');
  const { data } = matter(raw);
  const image = data.image || '';

  if (!image || !image.startsWith('/') || !image.endsWith('.svg')) {
    return null;
  }

  const source = publicPathToFile(image);
  if (!existsSync(source)) {
    console.warn(`[og:images] skip ${slug}: SVG ausente (${image})`);
    return null;
  }

  mkdirSync(OG_DIR, { recursive: true });
  const outputPath = path.join(OG_DIR, `${slug}.webp`);
  await svgToOgWebp(source, outputPath);
  console.log(`[og:images] ${slug} -> /images/og/${slug}.webp`);
  return slug;
}

async function main() {
  const files = readdirSync(ARTICLES_DIR).filter((file) => file.endsWith('.md'));
  let generated = 0;

  await ensureDefaultOgWebp();

  for (const file of files) {
    const result = await processArticle(file);
    if (result) generated += 1;
  }

  console.log(`[og:images] generated=${generated}`);
}

main().catch((error) => {
  console.error(`[og:images] ${error.message}`);
  process.exit(1);
});
