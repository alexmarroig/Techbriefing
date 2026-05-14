// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.techbriefing.com.br',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), sitemap()],
  vite: {
    esbuild: {
      jsxDev: false,
    },
  },
});
