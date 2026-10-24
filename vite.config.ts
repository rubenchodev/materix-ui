/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;

/** Una entrada por componente (`src/components/{slug}/index.ts`) más el barrel. */
function libraryEntries(): Record<string, string> {
  const entries: Record<string, string> = { index: resolve(root, 'src/index.ts') };
  const dir = resolve(root, 'src/components');
  if (!existsSync(dir)) return entries;
  for (const slug of readdirSync(dir)) {
    const file = resolve(dir, slug, 'index.ts');
    if (existsSync(file)) entries[`components/${slug}/index`] = file;
  }
  return entries;
}

/** Páginas de ejemplo (`examples/{slug}/index.html`); ignora `shared` y las carpetas `_*` (plantilla). */
function exampleInputs(): Record<string, string> {
  const inputs: Record<string, string> = { main: resolve(root, 'examples/index.html') };
  const dir = resolve(root, 'examples');
  if (!existsSync(dir)) return inputs;
  for (const slug of readdirSync(dir)) {
    if (slug === 'shared' || slug.startsWith('_')) continue;
    const file = resolve(dir, slug, 'index.html');
    if (existsSync(file)) inputs[slug] = file;
  }
  return inputs;
}

export default defineConfig(({ mode }) => {
  const alias = {
    '@rubenchodev/materix-react': resolve(root, 'src'),
  };

  // `vite build --mode examples`: ejemplos estáticos para Playwright.
  if (mode === 'examples') {
    return {
      plugins: [react()],
      resolve: { alias },
      root: resolve(root, 'examples'),
      base: './',
      // Las demos viven fuera de la raíz (`demos/{slug}`).
      server: { fs: { allow: [root] } },
      build: {
        outDir: resolve(root, 'dist-examples'),
        emptyOutDir: true,
        rollupOptions: { input: exampleInputs() },
      },
    };
  }

  return {
    plugins: [
      react(),
      dts({
        include: ['src'],
        exclude: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
        entryRoot: 'src',
      }),
    ],
    resolve: { alias },
    server: { open: '/examples/index.html' },
    build: {
      lib: {
        entry: libraryEntries(),
        formats: ['es'],
      },
      cssCodeSplit: true,
      sourcemap: true,
      rollupOptions: {
        // React y el CSS de @rubenchodev/materix-ui los resuelve la app consumidora.
        external: (id) =>
          id === 'react' ||
          id === 'react-dom' ||
          id.startsWith('react/') ||
          id.startsWith('react-dom/') ||
          id.startsWith('@rubenchodev/materix-ui'),
        output: {
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
      css: false,
    },
  };
});
