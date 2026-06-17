/**
 * Sincroniza imagens locais novas com o Sanity CDN (incremental).
 *
 * Uso:
 *   npm run sync:sanity-images              # dry-run
 *   npm run sync:sanity-images -- --apply   # upload + atualiza image-mapping.json
 *
 * Requer: SANITY_WRITE_TOKEN (ou SANITY_API_WRITE_TOKEN) e PUBLIC_SANITY_PROJECT_ID
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { createReadStream, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGE_ROOT = path.join(ROOT, 'public', 'images');
const OG_ROOT = path.join(ROOT, 'public', 'assets');
const MAPPING_FILE = path.join(__dirname, 'image-mapping.json');
const SUPPORTED_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']);
const SCAN_DIRS = ['news', 'radar', 'editorial', 'og'];

const apply = process.argv.includes('--apply');
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;

const client = token && projectId
  ? createClient({
      projectId,
      dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
      useCdn: false,
      apiVersion: '2024-01-01',
      token,
    })
  : null;

function loadMapping() {
  if (!existsSync(MAPPING_FILE)) return {};
  return JSON.parse(readFileSync(MAPPING_FILE, 'utf8'));
}

function collectImageFiles(dir, basePublicPath, files = []) {
  if (!existsSync(dir)) return files;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectImageFiles(fullPath, `${basePublicPath}/${entry.name}`, files);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!SUPPORTED_EXT.has(ext)) continue;

    files.push({
      fullPath,
      publicPath: `${basePublicPath}/${entry.name}`.replace(/\\/g, '/'),
    });
  }

  return files;
}

function listLocalImages() {
  const files = [];
  for (const sub of SCAN_DIRS) {
    collectImageFiles(path.join(IMAGE_ROOT, sub), `/images/${sub}`, files);
  }

  if (existsSync(path.join(OG_ROOT, 'og-default.svg'))) {
    files.push({
      fullPath: path.join(OG_ROOT, 'og-default.svg'),
      publicPath: '/assets/og-default.svg',
    });
  }
  if (existsSync(path.join(OG_ROOT, 'og-default.webp'))) {
    files.push({
      fullPath: path.join(OG_ROOT, 'og-default.webp'),
      publicPath: '/assets/og-default.webp',
    });
  }

  return files;
}

async function main() {
  const mapping = loadMapping();
  const files = listLocalImages();
  const pending = files.filter((file) => !mapping[file.publicPath]);

  console.log(`[sync:sanity-images] mode=${apply ? 'apply' : 'dry-run'} total=${files.length} pending=${pending.length}`);

  for (const file of pending) {
    console.log(`- ${file.publicPath}`);
  }

  if (pending.length === 0) {
    console.log('[sync:sanity-images] Nada para sincronizar.');
    return;
  }

  if (!apply) {
    console.log('[sync:sanity-images] Rode com --apply para enviar ao Sanity.');
    return;
  }

  if (!client) {
    console.error('[sync:sanity-images] SANITY_WRITE_TOKEN e PUBLIC_SANITY_PROJECT_ID são obrigatórios.');
    process.exit(1);
  }

  let uploaded = 0;
  for (const file of pending) {
    try {
      const asset = await client.assets.upload('image', createReadStream(file.fullPath), {
        filename: path.basename(file.fullPath),
      });
      mapping[file.publicPath] = asset._id;
      uploaded += 1;
      console.log(`[sync:sanity-images] uploaded ${file.publicPath} -> ${asset._id}`);
    } catch (error) {
      console.error(`[sync:sanity-images] erro em ${file.publicPath}: ${error.message}`);
    }
  }

  writeFileSync(MAPPING_FILE, `${JSON.stringify(mapping, null, 2)}\n`, 'utf8');
  console.log(`[sync:sanity-images] concluído uploaded=${uploaded} mapping=${MAPPING_FILE}`);
}

main().catch((error) => {
  console.error(`[sync:sanity-images] ${error.message}`);
  process.exit(1);
});
