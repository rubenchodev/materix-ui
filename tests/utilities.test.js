import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { buildUtilitiesCss, BREAKPOINTS, SPACING } from '../scripts/gen-utilities.mjs';

const root = path.resolve(__dirname, '..');
const srcCss = fs.readFileSync(path.join(root, 'src/styles/utilities.css'), 'utf-8');
const distPath = path.join(root, 'dist/materix.min.css');
const distCss = fs.existsSync(distPath) ? fs.readFileSync(distPath, 'utf-8') : '';

/**
 * Indica si la hoja contiene un selector de clase exacto.
 * @param {string} css Hoja de estilos.
 * @param {string} cls Clase sin punto.
 * @returns {boolean} Resultado.
 */
const hasClass = (css, cls) => new RegExp(`\\.${cls}(?![\\w-])`).test(css);

/**
 * Extrae el contenido de los bloques `@media (min-width: Npx)`.
 * @param {string} css Hoja.
 * @param {number} min Ancho mínimo.
 * @returns {string} Contenido concatenado de los bloques.
 */
const mediaBody = (css, min) => {
  const re = new RegExp(`@media\\s*\\(min-width:\\s*${min}px\\)\\s*\\{`, 'g');
  let out = '';
  let m = re.exec(css);
  while (m) {
    let depth = 1;
    let i = re.lastIndex;
    while (depth && i < css.length) {
      if (css[i] === '{') depth += 1;
      if (css[i] === '}') depth -= 1;
      i += 1;
    }
    out += css.slice(re.lastIndex, i);
    m = re.exec(css);
  }
  return out;
};

const KEY_CLASSES = [
  'mtx-d-none', 'mtx-d-flex', 'mtx-d-grid', 'mtx-d-contents',
  'mtx-flex-column', 'mtx-flex-wrap', 'mtx-flex-1', 'mtx-flex-shrink-0', 'mtx-min-w-0',
  'mtx-align-items-center', 'mtx-align-self-end', 'mtx-justify-content-between', 'mtx-align-content-center',
  'mtx-gap-2', 'mtx-row-gap-1_5', 'mtx-column-gap-3',
  'mtx-m-0', 'mtx-mt-2', 'mtx-ms-auto', 'mtx-mx-auto', 'mtx-py-10', 'mtx-pe-0_5', 'mtx-ps-2_5',
  'mtx-ml-auto', 'mtx-ml-2', 'mtx-pr-4',
  'mtx-w-100', 'mtx-h-100', 'mtx-mw-100', 'mtx-vh-100', 'mtx-min-vh-100',
  'mtx-text-center', 'mtx-text-truncate', 'mtx-line-clamp-2', 'mtx-fw-medium', 'mtx-tabular-nums', 'mtx-lh-1',
  'mtx-color-text-secondary', 'mtx-color-inherit', 'mtx-bg-paper', 'mtx-bg-primary', 'mtx-bg-action-selected',
  'mtx-visually-hidden', 'mtx-visually-hidden-focusable', 'mtx-skip-link',
  'mtx-position-sticky', 'mtx-sticky-top', 'mtx-top-0', 'mtx-inset-0', 'mtx-z-app-bar', 'mtx-z-modal',
  'mtx-overflow-hidden', 'mtx-overflow-x-auto',
  'mtx-border', 'mtx-border-bottom', 'mtx-border-0', 'mtx-border-primary', 'mtx-rounded', 'mtx-rounded-pill',
  'mtx-elevation-0', 'mtx-elevation-8', 'mtx-elevation-24',
  'mtx-stretched-link', 'mtx-pointer-events-none', 'mtx-user-select-none', 'mtx-cursor-pointer', 'mtx-object-cover',
];

const responsiveClasses = (bp) => [
  `mtx-d-${bp}-none`, `mtx-d-${bp}-flex`, `mtx-flex-${bp}-row`, `mtx-flex-${bp}-nowrap`,
  `mtx-align-items-${bp}-center`, `mtx-justify-content-${bp}-between`,
  `mtx-gap-${bp}-3`, `mtx-p-${bp}-4`, `mtx-px-${bp}-2`, `mtx-my-${bp}-0`, `mtx-text-${bp}-start`, `mtx-sticky-${bp}-top`,
];

describe('Utilidades (utilities.css)', () => {
  it('el archivo commiteado coincide con el generador (npm run gen:utilities)', () => {
    expect(srcCss).toBe(buildUtilitiesCss());
  });

  it('cada utilidad usa !important y cubre la escala de espaciado completa', () => {
    expect(srcCss).toMatch(/\.mtx-d-flex\{display:flex!important\}/);
    SPACING.forEach((n) => expect(hasClass(srcCss, `mtx-p-${n}`), n).toBe(true));
  });

  it('el dist contiene las clases clave', () => {
    expect(distCss.length).toBeGreaterThan(0);
    KEY_CLASSES.forEach((cls) => expect(hasClass(distCss, cls), cls).toBe(true));
  });

  it('las variantes responsive están dentro de su media query mobile-first', () => {
    Object.entries(BREAKPOINTS).forEach(([bp, min]) => {
      const body = mediaBody(distCss, min);
      responsiveClasses(bp).forEach((cls) => expect(hasClass(body, cls), `${cls} @${min}`).toBe(true));
    });
    expect(hasClass(mediaBody(distCss, 900), 'mtx-d-none')).toBe(false);
  });

  it('no genera variantes responsive en grupos que no las llevan', () => {
    expect(hasClass(distCss, 'mtx-pt-md-2')).toBe(false);
    expect(hasClass(distCss, 'mtx-w-md-100')).toBe(false);
  });

  it('[hidden] gana a las utilidades de display dentro de .mtx-root', () => {
    expect(distCss).toMatch(/\.mtx-root \[hidden\]\{display:none!important\}/);
  });

  it('define los tokens de espaciado y --mtx-app-bar-height responsive', () => {
    ['0', '2_5', 'unit'].forEach((n) => expect(distCss).toContain(`--mtx-spacing-${n}:`));
    expect(distCss).toMatch(/--mtx-app-bar-height:\s*56px/);
    expect(mediaBody(distCss, 600)).toMatch(/--mtx-app-bar-height:\s*64px/);
  });
});

describe('Utilidades — z-index, listas, scroll y stretched-link (plantillas)', () => {
  it('genera mtx-z-2 / mtx-z-3, mtx-list-unstyled y las utilidades de scroll', () => {
    expect(srcCss).toContain('.mtx-z-2{z-index:2!important}');
    expect(srcCss).toContain('.mtx-z-3{z-index:3!important}');
    expect(srcCss).toContain('.mtx-list-unstyled{list-style:none!important;padding:0!important;margin:0!important}');
    expect(srcCss).toContain('.mtx-scroll-smooth{scroll-behavior:smooth!important}');
    expect(srcCss).toContain('.mtx-scroll-mt-app-bar{scroll-margin-top:var(--mtx-app-bar-height,64px)!important}');
  });

  it('mtx-list-unstyled precede al espaciado para poder combinarse con mtx-m*-n', () => {
    expect(srcCss.indexOf('.mtx-list-unstyled{')).toBeLessThan(srcCss.indexOf('.mtx-mb-2{'));
  });

  it('mtx-scroll-smooth respeta prefers-reduced-motion', () => {
    expect(srcCss).toMatch(/@media \(prefers-reduced-motion:reduce\)\{\.mtx-scroll-smooth\{scroll-behavior:auto!important\}\}/);
  });

  it('los controles marcados quedan por encima del ::after del stretched-link', () => {
    expect(srcCss).toContain('.mtx-stretched-link::after{position:absolute;inset:0;z-index:1;content:""}');
    expect(srcCss).toContain('.mtx-stretched-link-above{position:relative!important;z-index:2!important}');
  });
});

describe('Utilidades — márgenes lógicos y de bloque responsive', () => {
  it('genera mtx-{ms,me,mt,mb}-{bp}-{n} y -auto dentro de su media query', () => {
    Object.entries(BREAKPOINTS).forEach(([bp, min]) => {
      const body = mediaBody(buildUtilitiesCss(), min);
      ['ms', 'me', 'mt', 'mb'].forEach((k) => {
        expect(hasClass(body, `mtx-${k}-${bp}-2`), `${k}-${bp}-2`).toBe(true);
        expect(hasClass(body, `mtx-${k}-${bp}-0_5`), `${k}-${bp}-0_5`).toBe(true);
        expect(hasClass(body, `mtx-${k}-${bp}-auto`), `${k}-${bp}-auto`).toBe(true);
      });
    });
    expect(hasClass(buildUtilitiesCss().split('@media')[0], 'mtx-ms-md-2')).toBe(false);
  });
});
