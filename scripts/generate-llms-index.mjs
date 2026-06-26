import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { renderLlmsIndex } from './lib/editorial-automation.mjs';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');
const OUT_PATH = path.join(ROOT, 'public', 'llms.txt');

async function main() {
  const files = (await readdir(ARTICLES_DIR)).filter((file) => file.endsWith('.md'));
  const articles = [];

  for (const file of files) {
    const raw = await readFile(path.join(ARTICLES_DIR, file), 'utf8');
    const { data } = matter(raw);
    articles.push({
      slug: file.replace(/\.md$/, ''),
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags || [],
      date: data.date,
    });
  }

  await writeFile(OUT_PATH, renderLlmsIndex(articles), 'utf8');
  console.log(`[llms:index] articles=${articles.length} path=${OUT_PATH}`);
}

main().catch((error) => {
  console.error(`[llms:index] ${error.message}`);
  process.exit(1);
});
