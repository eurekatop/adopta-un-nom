// @ts-check
import 'dotenv/config'; 
import { defineConfig } from 'astro/config';
import nodejs from '@astrojs/node';
import preact from '@astrojs/preact';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import shoelace from '@astrojs/shoelace';
//import copy from 'rollup-plugin-copy';

const isDev = process.env.NODE_ENV !== 'production';
const https = process.env.WG_HTTPS === 'true';

let httpsConfig = undefined;
if (isDev && https) {
  try {
    httpsConfig = {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost-cert.pem'),
    };
  } catch (err) {
    console.warn('⚠️  No s\'han trobat certificats HTTPS locals. Executa ./generate-localhost-cert.sh');
  }
}

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
  vite: {
    server: {
      https: httpsConfig,
    },
    plugins: [
        vanillaExtractPlugin(),
        //copy({
        //  // Copy only on first build. We dont want to trigger additional server reloads.
        //  copyOnce: true,
        //  hook: 'buildStart',
        //  targets: [
        //    { src: 'node_modules/@shoelace-style/shoelace/dist/assets/*', dest: 'public/shoelace-assets/assets/' }
        //  ]
        //})      
      ],
  },

  integrations: [preact()],
});