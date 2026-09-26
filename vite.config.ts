import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    // Never inline assets as data: URLs — the Content-Security-Policy in
    // vercel.json only allows same-origin fonts and media.
    assetsInlineLimit: 0,
  },
});
