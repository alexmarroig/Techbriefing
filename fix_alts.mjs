import fs from 'fs';
import path from 'path';

const articlesDir = 'c:/Users/gaming/tech-briefing/src/content/articles/';
const files = fs.readdirSync(articlesDir);
let fixedAlts = 0;

for (const file of files) {
  if (!file.endsWith('.md')) continue;

  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('![Ilustração do Artigo]')) {
    // extract title from frontmatter
    const titleMatch = content.match(/title:\s*["'](.*?)["']/);
    if (titleMatch) {
      const title = titleMatch[1];
      content = content.replace(/!\[Ilustração do Artigo\]/g, `![Ilustração visual para: ${title}]`);
      fs.writeFileSync(filePath, content, 'utf8');
      fixedAlts++;
    }
  }
}

console.log(`Fixed alt text in ${fixedAlts} articles.`);
