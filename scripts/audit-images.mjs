import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  isLocalImagePath,
  isUnsplashUrl,
  localImageExists,
} from './lib/resolve-image.mjs';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');

async function main() {
  const files = (await readdir(ARTICLES_DIR)).filter((file) => file.endsWith('.md'));
  const issues = [];

  for (const file of files) {
    const raw = await readFile(path.join(ARTICLES_DIR, file), 'utf8');
    const { data } = matter(raw);
    const slug = file.replace(/\.md$/, '');
    const image = data.image || '';

    if (!image) {
      issues.push({ slug, type: 'missing', detail: 'Sem campo image no frontmatter' });
      continue;
    }

    if (isUnsplashUrl(image)) {
      issues.push({ slug, type: 'unsplash', detail: image });
      continue;
    }

    if (isLocalImagePath(image) && !localImageExists(image)) {
      issues.push({ slug, type: 'broken-local', detail: image });
    }
  }

  console.log(`[audit:images] articles=${files.length} issues=${issues.length}`);

  for (const issue of issues) {
    console.log(`- [${issue.type}] ${issue.slug}: ${issue.detail}`);
  }

  if (issues.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(`[audit:images] ${error.message}`);
  process.exit(1);
});
