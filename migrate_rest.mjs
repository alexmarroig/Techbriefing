import fs from 'fs';
import path from 'path';
import fm from 'front-matter';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'vn3iz3iz',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN
});

function markdownToBlocks(markdown) {
  const blocks = [];
  if(!markdown) return blocks;
  const paragraphs = markdown.split('\n\n');
  
  for (const p of paragraphs) {
    if (!p.trim()) continue;
    let style = 'normal';
    let text = p.trim();
    if (text.startsWith('### ')) { style = 'h3'; text = text.substring(4); }
    else if (text.startsWith('## ')) { style = 'h2'; text = text.substring(3); }
    else if (text.startsWith('# ')) { style = 'h1'; text = text.substring(2); }
    else if (text.startsWith('> ')) { style = 'blockquote'; text = text.substring(2); }

    blocks.push({
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style,
      markDefs: [],
      children: [{ _type: 'span', _key: Math.random().toString(36).substring(7), marks: [], text: text }]
    });
  }
  return blocks;
}

const collections = [
  { name: 'apps', type: 'app', titleField: 'name' },
  { name: 'comparativos', type: 'comparativo', titleField: 'title' },
  { name: 'ebooks', type: 'ebook', titleField: 'title' },
  { name: 'tools', type: 'tool', titleField: 'name' },
  { name: 'glossario', type: 'glossario', titleField: 'title' }
];

async function migrate() {
  for (const collection of collections) {
    const dir = path.join(process.cwd(), 'src/content', collection.name);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.json'));

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        let attributes = {}, body = '';
        
        if (file.endsWith('.json')) {
           attributes = JSON.parse(content);
        } else {
           const parsed = fm(content);
           attributes = parsed.attributes;
           body = parsed.body;
        }

        const blocks = markdownToBlocks(body);
        const titleValue = attributes.title || attributes.name || 'Untitled';
        const doc = {
          _type: collection.type,
          slug: { _type: 'slug', current: file.replace('.md', '').replace('.json', '') },
          ...attributes,
          ...(blocks.length > 0 && { body: blocks })
        };

        doc[collection.titleField] = titleValue;
        
        if (collection.titleField === 'name' && doc.title) delete doc.title;
        else if (collection.titleField === 'title' && doc.name) delete doc.name;

        if (doc.date) doc.date = new Date(doc.date).toISOString();

        console.log(`Uploading: ${titleValue}...`);
        await client.create(doc);
      } catch(err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

migrate();
