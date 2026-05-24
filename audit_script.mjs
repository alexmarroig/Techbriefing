import fs from 'fs';
import path from 'path';

function walk(dir, extension, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      walk(path.join(dir, file), extension, fileList);
    } else if (file.endsWith(extension)) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const articlesDir = 'c:/Users/gaming/tech-briefing/src/';
const mdFiles = walk(articlesDir, '.md');
const astroFiles = walk(articlesDir, '.astro');
const jsxFiles = walk(articlesDir, '.jsx');

let missingAltImages = 0;
let potentialBrokenLinks = 0;

console.log(`Auditing ${mdFiles.length} Markdown, ${astroFiles.length} Astro, ${jsxFiles.length} JSX files...\n`);

for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  // Check images
  const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1].trim() === '' || match[1] === 'Ilustração do Artigo') {
       missingAltImages++;
    }
  }
}

console.log(`Found ${missingAltImages} markdown images with generic/missing alt text.`);
