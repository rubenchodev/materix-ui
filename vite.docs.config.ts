/**
 * Bundle de las islas React de la documentación Hugo (`npm run docs:islands`).
 * Entrada: docs/islands/main.tsx. Salida: docs/static/demos/ (islands.js, islands.css y chunks por demo).
 * El layout los carga con relURL, por eso `base: './'`: los chunks se resuelven relativos a islands.js.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const root = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@rubenchodev/materix-react': resolve(root, 'src'),
    },
  },
  base: './',
  publicDir: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: resolve(root, 'docs/static/demos'),
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      input: { islands: resolve(root, 'docs/islands/main.tsx') },
      output: {
        entryFileNames: '[name].js',
        // Chunks de demos con el slug del componente delante: chunks/button-01-basic-[hash].js.
        chunkFileNames: (chunk) => {
          const slug = chunk.facadeModuleId?.replace(/\\/g, '/').match(/\/demos\/([^/]+)\//)?.[1];
          return slug ? `chunks/${slug}-[name]-[hash].js` : 'chunks/[name]-[hash].js';
        },
        // El CSS de la entrada tiene nombre fijo (lo enlaza baseof.html); el de cada demo lleva hash.
        assetFileNames: (asset) =>
          (asset.names ?? []).includes('islands.css') ? 'islands.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
