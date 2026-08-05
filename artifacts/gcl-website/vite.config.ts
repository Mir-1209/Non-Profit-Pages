import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// ---------------------------------------------------------------------------
// PORT — required for dev/preview server; not needed during `vite build`.
// ---------------------------------------------------------------------------
const rawPort = process.env.PORT;
let devPort: number | undefined;

if (rawPort) {
  const parsed = Number(rawPort);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }
  devPort = parsed;
} else if (process.env.NODE_ENV !== 'production') {
  // Running dev/preview without PORT set: fall back to a safe default so the
  // dev server still starts rather than crashing.
  devPort = 5173;
}
// During `vite build` (NODE_ENV=production + no PORT) devPort stays undefined —
// the server/preview blocks are irrelevant and are left unconfigured.

// ---------------------------------------------------------------------------
// BASE_PATH — controls the Vite `base` option.
//   • Replit sets BASE_PATH to the proxy sub-path (e.g. "/gcl-website/").
//   • Vercel and other standard hosts serve at root ("/").
// ---------------------------------------------------------------------------
const basePath = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    // Runtime error overlay — Replit dev only; no-op in production builds.
    ...(process.env.NODE_ENV !== 'production'
      ? [
          await import('@replit/vite-plugin-runtime-error-modal').then((m) =>
            m.default(),
          ),
        ]
      : []),
    // Replit-specific plugins — only active inside a Repl.
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  // server / preview are only relevant when a port is resolved.
  ...(devPort !== undefined
    ? {
        server: {
          port: devPort,
          strictPort: true,
          host: '0.0.0.0',
          allowedHosts: true,
          fs: { strict: true },
        },
        preview: {
          port: devPort,
          host: '0.0.0.0',
          allowedHosts: true,
        },
      }
    : {}),
});
