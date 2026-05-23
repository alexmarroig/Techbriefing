const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'src', 'content', 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

let updated = {
  "Lucas Andrade": 0,
  "Mariana Costa": 0,
  "Thiago Mendes": 0
};

for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Decide the author based on keywords in the content or filename
  let author = "Thiago Mendes"; // Default to ops/no-code
  
  const textToLower = content.toLowerCase();
  
  if (textToLower.includes('python') || textToLower.includes('langgraph') || textToLower.includes('api') || textToLower.includes('github') || textToLower.includes('codigo') || textToLower.includes('engenharia')) {
    author = "Lucas Andrade";
  } else if (textToLower.includes('negocio') || textToLower.includes('estrategia') || textToLower.includes('roi') || textToLower.includes('vendas') || textToLower.includes('rh') || textToLower.includes('custos') || textToLower.includes('empresas')) {
    author = "Mariana Costa";
  }

  // Find author line in frontmatter
  const authorRegex = /author:\s*["'].*?["']/;
  if (authorRegex.test(content)) {
    const newContent = content.replace(authorRegex, `author: "${author}"`);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    updated[author]++;
  }
}

console.log("Autores reatribuídos:");
console.log(updated);
