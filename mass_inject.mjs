import fs from 'fs';
import path from 'path';

const articlesDir = 'c:/Users/gaming/tech-briefing/src/content/articles/';
const files = fs.readdirSync(articlesDir);

const techImages = [
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
];

let imgIndex = 0;
let patchedImages = 0;
let patchedTables = 0;

for (const file of files) {
  if (!file.endsWith('.md')) continue;

  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Inject Image if missing
  if (!content.includes('![') && !content.includes('<img')) {
    const lines = content.split('\n');
    let inFrontmatter = false;
    let frontmatterEnded = false;
    let injectionIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('---')) {
        if (!inFrontmatter && !frontmatterEnded) {
          inFrontmatter = true;
        } else if (inFrontmatter) {
          inFrontmatter = false;
          frontmatterEnded = true;
        }
        continue;
      }

      if (frontmatterEnded && lines[i].startsWith('## ')) {
        injectionIndex = i + 1;
        break;
      }
    }

    if (injectionIndex !== -1) {
      const imgUrl = techImages[imgIndex % techImages.length];
      imgIndex++;
      const imgMarkdown = `\n![Ilustração do Artigo](${imgUrl})\n`;
      lines.splice(injectionIndex, 0, imgMarkdown);
      content = lines.join('\n');
      patchedImages++;
      changed = true;
    }
  }

  // 2. Inject Table if comparison and missing
  if ((file.includes('-vs-') || file.includes('-ou-')) && !content.includes('|---|')) {
    // Try to extract names from filename
    let parts = file.replace('.md', '').split(/-vs-|-ou-/);
    if (parts.length === 2) {
      const name1 = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/-/g, ' ');
      const name2 = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).replace(/-/g, ' ');
      
      const tableMarkdown = `\n## Resumo Comparativo: ${name1} vs ${name2}\n\n| Critério | ${name1} | ${name2} |\n|---|---|---|\n| **Foco Principal** | Analisar caso a caso | Analisar caso a caso |\n| **Curva de Aprendizado** | Relativa | Relativa |\n| **Custo-benefício** | Depende do escopo | Depende do escopo |\n\n`;
      
      // Inject before ## Conclusão if it exists, otherwise at the end
      if (content.includes('## Conclusão')) {
        content = content.replace('## Conclusão', tableMarkdown + '## Conclusão');
      } else {
        content += tableMarkdown;
      }
      patchedTables++;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

console.log(`Successfully patched ${patchedImages} articles with images and ${patchedTables} articles with tables.`);
