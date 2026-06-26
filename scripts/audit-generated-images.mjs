import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { isLocalImagePath, localImageExists } from './lib/resolve-image.mjs';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');

function isGeneratedArticle(slug = '', data = {}) {
  return data.editorialType === 'automated-news-analysis'
    || /^radar-tech-\d{4}-\d{2}-\d{2}$/.test(slug)
    || /-\d{4}-\d{2}-\d{2}$/.test(slug);
}

async function main() {
  const files = (await readdir(ARTICLES_DIR)).filter((file) => file.endsWith('.md'));
  const issues = [];

  for (const file of files) {
    const raw = await readFile(path.join(ARTICLES_DIR, file), 'utf8');
    const { data } = matter(raw);
    const slug = file.replace(/\.md$/, '');
    const image = data.image || '';

    if (!isGeneratedArticle(slug, data)) continue;
    if (!image || !isLocalImagePath(image)) {
      issues.push({ slug, type: 'non-local', detail: image || 'missing' });
      continue;
    }

    if (!localImageExists(image)) {
      issues.push({ slug, type: 'broken-local', detail: image });
      continue;
    }

    const imagePath = path.join(ROOT, 'public', image.replace(/^\//, ''));
    const imageRaw = await readFile(imagePath, 'utf8');
    if (!/<title[\s\S]*?<\/title>/i.test(imageRaw) || !/<desc[\s\S]*?<\/desc>/i.test(imageRaw)) {
      issues.push({ slug, type: 'missing-metadata', detail: image });
    }
    if (!/radar|tech briefing|agentes|automacao|ia|seo|robot/i.test(imageRaw)) {
      issues.push({ slug, type: 'low-signal', detail: image });
    }
  }

  console.log(`[audit:generated-images] articles=${files.length} issues=${issues.length}`);
  for (const issue of issues) {
    console.log(`- [${issue.type}] ${issue.slug}: ${issue.detail}`);
  }

  if (issues.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(`[audit:generated-images] ${error.message}`);
  process.exit(1);
});
