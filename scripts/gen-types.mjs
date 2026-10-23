/**
 * Genera las declaraciones TypeScript base a partir del JSDoc de `src/`.
 *
 * - `types/lib/**`: declaraciones de cada módulo fuente (sin miembros privados `_*`).
 * - `types/components/{slug}.d.ts`: punto de entrada de `materix-ui/components/{slug}`.
 *
 * Los archivos escritos a mano (`types/index.d.ts`, `types/core.d.ts`, `types/events.d.ts`)
 * refinan y completan esta base. Uso: `npm run build:types`.
 */
import ts from 'typescript';
import { readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = resolve(root, 'src');
const libDir = resolve(root, 'types/lib');
const componentsDir = resolve(root, 'types/components');

const slugs = readdirSync(resolve(srcDir, 'components'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const files = [
  resolve(srcDir, 'index.js'),
  ...readdirSync(resolve(srcDir, 'core')).filter((f) => f.endsWith('.js')).map((f) => resolve(srcDir, 'core', f)),
  resolve(srcDir, 'i18n/index.js'),
  ...slugs.map((slug) => resolve(srcDir, 'components', slug, `${slug}.js`)),
];

/**
 * Elimina de clases y espacios de nombres los miembros privados (prefijo `_`).
 * @param {string} text Declaración generada.
 * @param {string} fileName Nombre del archivo.
 * @returns {string} Declaración filtrada.
 */
function stripPrivate(text, fileName) {
  const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const isPrivateName = (node) => node.name && ts.isIdentifier(node.name) && node.name.text.startsWith('_');
  const ranges = [];
  const visit = (node) => {
    if ((ts.isClassElement(node) || ts.isTypeElement(node)) && isPrivateName(node)) {
      ranges.push([node.getFullStart(), node.getEnd()]);
      return;
    }
    if (ts.isFunctionDeclaration(node) && isPrivateName(node) && ts.isModuleBlock(node.parent)) {
      ranges.push([node.getFullStart(), node.getEnd()]);
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  let out = text;
  ranges.sort((a, b) => b[0] - a[0]).forEach(([start, end]) => {
    out = out.slice(0, start) + out.slice(end);
  });
  return out;
}

const options = {
  allowJs: true,
  declaration: true,
  emitDeclarationOnly: true,
  skipLibCheck: true,
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  rootDir: srcDir,
  outDir: libDir,
};

rmSync(libDir, { recursive: true, force: true });
rmSync(componentsDir, { recursive: true, force: true });

const program = ts.createProgram(files, options);
const emitted = [];
const result = program.emit(undefined, (fileName, text) => {
  mkdirSync(dirname(fileName), { recursive: true });
  writeFileSync(fileName, stripPrivate(text, fileName));
  emitted.push(fileName);
});

// Solo los errores de emisión de declaraciones (sin checkJs, el JS no se valida aquí).
const diagnostics = result.diagnostics.filter((d) => d.category === ts.DiagnosticCategory.Error);
if (diagnostics.length) {
  console.error(ts.formatDiagnostics(diagnostics, {
    getCanonicalFileName: (f) => f, getCurrentDirectory: () => root, getNewLine: () => '\n',
  }));
  process.exit(1);
}

mkdirSync(componentsDir, { recursive: true });
const aliases = {
  'date-time-picker': 'export { DateTimePicker as DatePicker, DateTimePicker as TimePicker, DateTimePicker as DateRangePicker, DateTimePicker as DateTimeRangePicker } from \'../lib/components/date-time-picker/date-time-picker.js\';\n',
};
slugs.forEach((slug) => {
  const body = [
    `// Generado por scripts/gen-types.mjs: materix-ui/components/${slug}`,
    `export * from '../lib/components/${slug}/${slug}.js';`,
    'import \'../events.js\';',
    '',
  ].join('\n');
  writeFileSync(resolve(componentsDir, `${slug}.d.ts`), body + (aliases[slug] || ''));
});

console.log(`types: ${emitted.length} declaraciones en ${relative(root, libDir)}, ${slugs.length} entradas en ${relative(root, componentsDir)}`);
