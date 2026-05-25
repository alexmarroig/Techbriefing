const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/gaming/tech-briefing/src/sanity/schemas';

const replacements = [
  { bad: 'Ttulo', good: 'Título' },
  { bad: 'Descriǜo', good: 'Descrição' },
  { bad: 'Preo', good: 'Preço' },
  { bad: 'Pǭginas', good: 'Páginas' },
  { bad: 'Benefcios', good: 'Benefícios' },
  { bad: 'Y"', good: '📊' }, // Icons might be mangled too
  { bad: 's"', good: '⚖️' },
  { bad: 'TendǦncias', good: 'Tendências' },
  { bad: 'Negcios', good: 'Negócios' },
  { bad: 'Automaǜo', good: 'Automação' },
  { bad: 'Prǭtica', good: 'Prática' },
  { bad: 'Conteǧdo', good: 'Conteúdo' },
  { bad: 'captulos', good: 'capítulos' },
  { bad: 'nǜo', good: 'não' },
  { bad: 'mǭx.', good: 'máx.' }
];

function walk(directory) {
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      for (const { bad, good } of replacements) {
        if (content.includes(bad)) {
          content = content.split(bad).join(good);
          changed = true;
        }
      }
      if (changed) {
        console.log("Fixed encodings in", file);
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  });
}

walk(dir);
