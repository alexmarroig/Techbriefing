import fs from 'fs';

const articlePath = 'c:/Users/gaming/tech-briefing/src/content/articles/autogpt-crewai-langgraph.md';
let content = fs.readFileSync(articlePath, 'utf8');

const tableContent = `
## Tabela Comparativa: AutoGPT vs CrewAI vs LangGraph

| Funcionalidade / Framework | AutoGPT | CrewAI | LangGraph |
|---|---|---|---|
| **Abordagem** | Autônomo irrestrito | Multi-agente hierárquico | Grafos e Máquinas de Estado |
| **Curva de Aprendizado** | Baixa (pronto pra uso) | Média (Python básico) | Alta (Arquitetura de software) |
| **Previsibilidade** | Muito Baixa | Média / Alta | Muito Alta |
| **Melhor Caso de Uso** | Scripts e automações rápidas | Marketing, Research, Fluxos claros | Sistemas Enterprise, SaaS, Backend |
| **Controle de Estado** | Não possui | Via Tarefas | Via StateGraph (Memória persistente) |

`;

content = content.replace('## Conclusão: Matriz de Decisão', tableContent + '\n## Conclusão: Matriz de Decisão');

const imageContent = `\n![Comparativo de Agentes de IA](https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200)\n`;
content = content.replace('## O declínio do AutoGPT', imageContent + '\n## O declínio do AutoGPT');

fs.writeFileSync(articlePath, content, 'utf8');

// Now, let's just make a quick pass on all comparative articles to inject a basic table structure if they have "vs" and lack a table.
const articlesDir = 'c:/Users/gaming/tech-briefing/src/content/articles/';
const files = fs.readdirSync(articlesDir);

for (const file of files) {
  if (file.endsWith('.md')) {
    let md = fs.readFileSync(articlesDir + file, 'utf8');
    let changed = false;
    
    // If it's a comparison article but has no table
    if (file.includes('-vs-') && !md.includes('|---|')) {
      const parts = file.replace('.md', '').split('-vs-');
      if (parts.length === 2 && md.includes('## Conclusão')) {
        const tname1 = parts[0].toUpperCase();
        const tname2 = parts[1].toUpperCase();
        const genericTable = `\n## Comparativo Direto: ${tname1} vs ${tname2}\n\n| Critério | ${tname1} | ${tname2} |\n|---|---|---|\n| **Foco Principal** | Analisar caso a caso | Analisar caso a caso |\n| **Curva de Aprendizado** | Relativa | Relativa |\n| **Custo-benefício** | Depende do escopo | Depende do escopo |\n\n`;
        md = md.replace('## Conclusão', genericTable + '## Conclusão');
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(articlesDir + file, md, 'utf8');
      console.log('Patched ' + file);
    }
  }
}

console.log('Done patching articles');
