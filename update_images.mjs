/**
 * @deprecated Use `npm run curate:images` instead.
 * This script injected generic Unsplash URLs without editorial curation.
 */
import fs from 'fs';
import path from 'path';

const dir = 'c:/Users/gaming/tech-briefing/src/content/articles';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const unsplashUrls = [
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1531297172864-742c65f84b65?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1580894732444-8ecbef79bd14?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=1200'
];

let imgIndex = 0;
let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('Agentes') || file.includes('agente')) {
    const url = unsplashUrls[imgIndex % unsplashUrls.length];
    
    // Replace image line
    const newContent = content.replace(/image:\s*".*?"/, 'image: "' + url + '"');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      modifiedCount++;
      imgIndex++;
    }
  }
}

console.log('Updated ' + modifiedCount + ' files with Unsplash images!');
