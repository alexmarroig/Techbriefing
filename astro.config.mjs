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
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const excludedPaths = [
          '/admin',
          '/checkout',
          '/obrigado',
          '/agentes-ia-premium',
          '/agentes-ia-premium-promo',
          '/ebook-agentes-ia-promo'
        ];
        return !excludedPaths.some(path => page.includes(path));
      }
    })
  ],
  vite: {
    esbuild: {
      jsxDev: false,
    },
  },
});
