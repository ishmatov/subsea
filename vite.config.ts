import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    (function htmlBasePlugin() {
      let baseHref = './';
      return {
        name: 'html-base',
        configResolved(config) {
          baseHref = config.base.endsWith('/') ? config.base : config.base + '/';
        },
        transformIndexHtml(html) {
          return html.replace(
            /(<head[^>]*>)/i,
            `$1\n    <base href="${baseHref}">`
          );
        },
      };
    })(),
  ],
  base: './', // Для GitHub Pages: используйте base: '/subsea/' и npm run build:gh
})
