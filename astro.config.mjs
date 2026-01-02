// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

import robotsTxt from 'astro-robots-txt';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://enderworks.in',
  integrations: [mdx(), sitemap(), robotsTxt(), react()],
  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // @ts-ignore
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
  },
});