const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'src', 'content', 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

let updated = 0;

for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if it's featured
  if (!content.includes('featured: true')) continue;
  
  // Check if it already has Resumo rápido
  if (content.includes('## Resumo rápido')) continue;

  // Extract description
  const descMatch = content.match(/description:\s*["'](.*?)["']/);
  if (!descMatch) continue;
  
  const description = descMatch[1];
  
  // Find the end of the frontmatter
  const parts = content.split('---');
  if (parts.length >= 3) {
    const frontmatter = parts[1];
    let body = parts.slice(2).join('---');
    
    // Inject Resumo rápido right at the start of the body
    const resumoRapido = `\n\n## Resumo rápido\n\n${description}\n\n`;
    
    const newContent = `---${frontmatter}---${resumoRapido}${body.trimStart()}`;
    fs.writeFileSync(filePath, newContent, 'utf-8');
    updated++;
    console.log(`Injetado em: ${file}`);
  }
}

console.log(`Total atualizado: ${updated}`);
