import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Materix',
      formats: ['es', 'umd'],
      fileName: (format) => `materix.${format === 'es' ? 'es' : 'umd'}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: 'materix.min.css',
        exports: 'named',
      },
    },
    cssCodeSplit: false,
    minify: 'esbuild',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.js'],
    include: ['tests/**/*.test.js'],
  },
});