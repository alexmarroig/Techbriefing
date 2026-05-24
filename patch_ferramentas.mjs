import fs from 'fs';

let jsx = fs.readFileSync('c:/Users/gaming/tech-briefing/src/components/pages/FerramentasPage.jsx', 'utf8');

const urlMap = {
  'n8n': 'https://n8n.io/',
  'Make': 'https://www.make.com/',
  'OpenAI': 'https://openai.com/',
  'Claude (Anthropic)': 'https://claude.ai/',
  'Perplexity': 'https://www.perplexity.ai/',
  'Notion': 'https://www.notion.so/',
  'Cursor': 'https://cursor.sh/',
  'Framer': 'https://www.framer.com/',
  'Webflow': 'https://webflow.com/',
  'Beehiiv': 'https://www.beehiiv.com/',
  'ConvertKit': 'https://convertkit.com/',
  'Semrush': 'https://www.semrush.com/',
  'Ahrefs': 'https://ahrefs.com/',
  'Descript': 'https://www.descript.com/',
  'CapCut': 'https://www.capcut.com/',
  'Canva': 'https://www.canva.com/',
  'Railway': 'https://railway.app/',
  'Vercel': 'https://vercel.com/',
  'Supabase': 'https://supabase.com/',
  'Replit': 'https://replit.com/',
  'Tally': 'https://tally.so/',
  'Typeform': 'https://www.typeform.com/'
};

// Fix static categories to include href
for (const [name, url] of Object.entries(urlMap)) {
  const regex = new RegExp(`name:'` + name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&') + `'(.*?)(aff:(true|false))}`, 'g');
  jsx = jsx.replace(regex, `name:'${name}'$1$2,href:'${url}'}`);
}

// Fix mapping
jsx = jsx.replace(/aff:\\s*tool\\.affiliate,/, 'aff: tool.affiliate,\n        href: tool.url || urlMap[tool.name] || "#",');

// Ensure urlMap is available inside App if needed by injecting it before App
jsx = jsx.replace(/function App/, 'const urlMap = ' + JSON.stringify(urlMap) + ';\nfunction App');

fs.writeFileSync('c:/Users/gaming/tech-briefing/src/components/pages/FerramentasPage.jsx', jsx, 'utf8');

// Now update the JSON files to have correct URLs instead of /ferramentas
const toolsDir = 'c:/Users/gaming/tech-briefing/src/content/tools/';
const files = fs.readdirSync(toolsDir);
for (const file of files) {
  if (file.endsWith('.json')) {
    const filePath = toolsDir + file;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (urlMap[data.name]) {
      data.url = urlMap[data.name];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
  }
}

console.log('Fixed URLs in FerramentasPage and JSON tools');
