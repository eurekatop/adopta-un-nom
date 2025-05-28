// @ts-check
import { defineConfig } from 'astro/config';
import nodejs from '@astrojs/node';
import preact from '@astrojs/preact';

const isDev = process.env.NODE_ENV !== 'production';

let httpsConfig = undefined;
if (isDev) {
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
    }
  },

  integrations: [preact()],
});