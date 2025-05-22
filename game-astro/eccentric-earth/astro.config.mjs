// @ts-check
import { defineConfig } from 'astro/config';
import nodejs from '@astrojs/node';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  output: "server",

  base: '/wordguardian/', 

  adapter: nodejs({
      mode: 'standalone' 
  }),

  server: {
    host: true, // listen on all available network interfaces
  },

  integrations: [preact()],
});