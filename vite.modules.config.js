/**
 * Build de módulos ES por componente (tree-shaking).
 *
 * Se ejecuta DESPUÉS del build principal (`vite build`) y escribe en `dist/` sin vaciarla:
 * - `dist/components/{slug}.js`: se registra a sí mismo, programa `initAll()` e importa
 *   los `.css` individuales que necesita (el suyo y los de sus dependencias).
 * - `dist/components/{slug}.css`: estilos propios del componente (sin tokens ni base).
 * - `dist/components/{slug}.bundle.css`: componente + dependencias (para `<link>` sin bundler).
 * - `dist/core.js`: registry, ComponentBase, eventos, tema, i18n y posicionamiento.
 * - `dist/base.css` (tokens + base + ripple) y `dist/utilities.css`.
 * - `dist/materix.umd.cjs`: copia del UMD para `require()`.
 * - `dist/chunks/*`: código compartido (el núcleo se emite una sola vez).
 */
import { defineConfig, transformWithEsbuild } from 'vite';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = __dirname;
const src = (...parts) => resolve(root, 'src', ...parts).replace(/\\/g, '/');

/** Slugs de componente = carpetas de `src/components`. */
const slugs = readdirSync(resolve(root, 'src/components'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

/**
 * Componentes cuyo marcado genera el JS de otro componente sin importar su módulo
 * (p. ej. Card crea `.mtx-avatar`): solo necesitan su CSS.
 */
const renderedCssDeps = {
  'button-group': ['button'],
  card: ['avatar', 'icon-button'],
  'date-time-picker': ['button', 'icon-button'],
  drawer: ['avatar', 'icon-button'],
  'speed-dial': ['fab'],
  stack: ['divider'],
  stepper: ['button'],
  'text-field': ['icon-button'],
};

/** Componentes importados por el JS de cada componente (`../{slug}/{slug}.js`). */
const jsDeps = Object.fromEntries(slugs.map((slug) => {
  const code = readFileSync(resolve(root, 'src/components', slug, `${slug}.js`), 'utf8');
  const found = [...code.matchAll(/import\s+(?:[^'"]*?from\s+)?['"]\.\.\/([a-z-]+)\/\1\.js['"]/g)].map((m) => m[1]);
  return [slug, [...new Set(found)]];
}));

/**
 * Componentes cuyo CSS necesita `slug`, en orden de dependencia (dependencias primero, `slug` al final).
 * @param {string} slug Componente.
 * @returns {string[]} Slugs deduplicados.
 */
function cssClosure(slug) {
  const order = [];
  const visit = (name, stack) => {
    if (order.includes(name) || stack.has(name) || !slugs.includes(name)) return;
    stack.add(name);
    [...(jsDeps[name] || []), ...(renderedCssDeps[name] || [])].forEach((dep) => visit(dep, stack));
    stack.delete(name);
    order.push(name);
  };
  visit(slug, new Set());
  return order;
}

/** Alias de exportación que el bundle completo ofrece y no están en el módulo fuente. */
const extraExports = {
  'date-time-picker': [
    'export { DateTimePicker as DatePicker, DateTimePicker as TimePicker,',
    '  DateTimePicker as DateRangePicker, DateTimePicker as DateTimeRangePicker };',
    `import { DateTimePicker } from '${src('components/date-time-picker/date-time-picker.js')}';`,
  ].join('\n'),
};

const VIRTUAL = 'mtx-entry:';

/** Código de cada entrada virtual. */
function entryCode(name) {
  if (name === 'core') {
    return [
      `export { registerComponent, initAll, initElement, init, getInstance, watch, destroy, destroyAll } from '${src('core/registry.js')}';`,
      `export { ComponentBase } from '${src('core/component-base.js')}';`,
      `export { createRipple } from '${src('core/ripple.js')}';`,
      `export { emit } from '${src('core/events.js')}';`,
      `export { theme } from '${src('core/theme.js')}';`,
      `export { computePosition, autoUpdate } from '${src('core/position.js')}';`,
      `export { i18n, getLocale, setLocale, addLocale, updateLocale, getDictionary, t, getComponentLocale } from '${src('i18n/index.js')}';`,
    ].join('\n');
  }
  const file = src(`components/${name}/${name}.js`);
  return [
    `export * from '${file}';`,
    extraExports[name] || '',
    `import { scheduleAutoInit } from '${src('core/auto-init.js')}';`,
    'scheduleAutoInit();',
  ].join('\n');
}

/** Minifica CSS con el mismo motor (esbuild) que el bundle principal. */
async function minifyCss(code, name) {
  const result = await transformWithEsbuild(code, `${name}.css`, {
    loader: 'css',
    minify: true,
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  });
  return result.code;
}

/**
 * Plugin: entradas virtuales por componente y emisión de los CSS separados.
 * @returns {import('vite').Plugin}
 */
function materixModules() {
  return {
    name: 'materix-modules',
    resolveId(id) {
      const at = id.indexOf(VIRTUAL);
      if (at !== -1) return `\0${id.slice(at)}`;
      return null;
    },
    load(id) {
      if (id.startsWith(`\0${VIRTUAL}`)) return entryCode(id.slice(VIRTUAL.length + 1));
      return null;
    },
    async generateBundle(_options, bundle) {
      const read = (path) => readFileSync(resolve(root, 'src', path), 'utf8');
      // Cada módulo de componente importa (efecto secundario) los CSS individuales que necesita:
      // `import 'materix-ui/components/autocomplete'` trae sus estilos y los de sus dependencias,
      // y el bundler del consumidor deduplica cada `.css` aunque lo importen varios componentes.
      Object.values(bundle).forEach((chunk) => {
        if (chunk.type !== 'chunk' || !chunk.isEntry || !chunk.name.startsWith('components/')) return;
        const slug = chunk.name.slice('components/'.length);
        const imports = cssClosure(slug).map((dep) => `import "./${dep}.css";`).join('\n');
        chunk.code = `${imports}\n${chunk.code}`;
      });
      const emit = async (fileName, code) => {
        this.emitFile({ type: 'asset', fileName, source: await minifyCss(code, fileName) });
      };
      // Copia CommonJS del UMD para `require()` (el paquete es "type": "module").
      const umd = resolve(root, 'dist/materix.umd.js');
      if (existsSync(umd)) {
        this.emitFile({ type: 'asset', fileName: 'materix.umd.cjs', source: readFileSync(umd, 'utf8') });
      } else {
        this.warn('dist/materix.umd.js no existe: ejecuta primero `vite build` (npm run build lo hace).');
      }
      await emit('base.css',[read('styles/tokens.css'), read('styles/base.css'), read('styles/ripple.css')].join('\n'));
      await emit('utilities.css', read('styles/utilities.css'));
      const ownCss = (slug) => {
        const cssPath = resolve(root, 'src/components', slug, `${slug}.css`);
        // Sin estilos propios (p. ej. css-baseline vive en base.css): vacío para que el import no falle.
        return existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';
      };
      for (const slug of slugs) {
        // {slug}.css: solo el componente (lo importa el JS; deduplicable).
        await emit(`components/${slug}.css`, ownCss(slug));
        // {slug}.bundle.css: componente + dependencias, para <link>/CDN sin bundler.
        await emit(`components/${slug}.bundle.css`, cssClosure(slug).map(ownCss).join('\n'));
      }
    },
  };
}

const entry = { core: `${VIRTUAL}core` };
slugs.forEach((slug) => { entry[`components/${slug}`] = `${VIRTUAL}${slug}`; });

export default defineConfig({
  plugins: [materixModules()],
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry,
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
        // Todo el núcleo (registry, base, eventos, tema, i18n, posición…) en un único chunk compartido.
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('/src/core/') || normalized.includes('/src/i18n/')) return 'core';
          return undefined;
        },
      },
    },
    minify: 'esbuild',
    reportCompressedSize: false,
  },
});
