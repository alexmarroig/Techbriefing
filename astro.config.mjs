// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.techbriefing.com.br',
  integrations: [react(), sitemap()],
  vite: {
    esbuild: {
      jsxDev: false,
    },
  },
});
