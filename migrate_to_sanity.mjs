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

// Basic Markdown to PortableText converter
function markdownToBlocks(markdown) {
  const blocks = [];
  const paragraphs = markdown.split('\n\n');
  
  for (const p of paragraphs) {
    if (!p.trim()) continue;
    
    // Quick heuristic: if it starts with # it's a heading
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
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).substring(7),
          marks: [],
          text: text
        }
      ]
    });
  }
  return blocks;
}

async function migrate() {
  console.log("Starting migration...");
  const articlesDir = path.join(process.cwd(), 'src/content/articles');
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
      const { attributes, body } = fm(content);
      
      const blocks = markdownToBlocks(body);

      const doc = {
        _type: 'article',
        title: attributes.title || 'Untitled',
        slug: { _type: 'slug', current: file.replace('.md', '') },
        description: attributes.description || '',
        category: attributes.category || 'Outros',
        author: attributes.author || 'Tech Briefing',
        date: attributes.date ? new Date(attributes.date).toISOString() : new Date().toISOString(),
        readTime: attributes.readTime || '5 min',
        featured: !!attributes.featured,
        tags: attributes.tags || [],
        faq: attributes.faq || [],
        body: blocks
      };

      console.log(`Uploading: ${doc.title}...`);
      await client.create(doc);
    } catch(err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
  console.log("Migration complete!");
}

migrate();
