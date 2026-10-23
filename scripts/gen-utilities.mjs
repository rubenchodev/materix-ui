/**
 * Materix UI — Generador de src/styles/utilities.css.
 *
 * La tabla de configuración de este archivo es la única fuente de verdad de
 * las clases utilitarias. Ejecutar `npm run gen:utilities` tras modificarla.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

/** Breakpoints canónicos (mobile-first, min-width). xs no lleva infijo. */
export const BREAKPOINTS = { sm: 600, md: 900, lg: 1200, xl: 1536 };

/** Escala de espaciado: clave de clase → token. */
export const SPACING = ['0', '0_5', '1', '1_5', '2', '2_5', '3', '4', '5', '6', '8', '10'];

const sp = (n) => `var(--mtx-spacing-${n})`;

/**
 * Construye una tabla de utilidades simple a partir de un mapa sufijo → declaraciones.
 * @param {string} prefix Prefijo de clase sin `mtx-`.
 * @param {Object<string,string>} map Sufijo → declaraciones CSS.
 * @param {boolean} responsive Si genera variantes `{bp}`.
 * @returns {{prefix:string,map:Object,responsive:boolean}} Grupo.
 */
const group = (prefix, map, responsive = false) => ({ prefix, map, responsive });

const mapOf = (keys, fn) => Object.fromEntries(keys.map((k) => [k, fn(k)]));

const spacingProps = {
  m: ['margin'],
  mt: ['margin-top'],
  mb: ['margin-bottom'],
  ms: ['margin-inline-start'],
  me: ['margin-inline-end'],
  mx: ['margin-inline'],
  my: ['margin-block'],
  p: ['padding'],
  pt: ['padding-top'],
  pb: ['padding-bottom'],
  ps: ['padding-inline-start'],
  pe: ['padding-inline-end'],
  px: ['padding-inline'],
  py: ['padding-block'],
};
const responsiveSpacing = new Set(['m', 'mt', 'mb', 'ms', 'me', 'mx', 'my', 'p', 'px', 'py']);
const autoSpacing = new Set(['m', 'ms', 'me', 'mx', 'mt', 'mb']);

/** Alias heredados de base.css (físicos, 0–4 y auto). Se mantienen por compatibilidad. */
const legacyAlias = {
  ml: 'margin-left',
  mr: 'margin-right',
  pl: 'padding-left',
  pr: 'padding-right',
};

const flexAlign = { start: 'flex-start', center: 'center', end: 'flex-end', baseline: 'baseline', stretch: 'stretch' };
const justify = {
  start: 'flex-start', center: 'center', end: 'flex-end',
  between: 'space-between', around: 'space-around', evenly: 'space-evenly',
};

/**
 * Tabla de configuración. Cada entrada genera `.mtx-{prefix}-{sufijo}`.
 * Un sufijo vacío ('') genera `.mtx-{prefix}`.
 */
export const CONFIG = [
  // Display
  group('d', mapOf(['none', 'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'contents'], (v) => `display:${v}`), true),

  // Listas (antes del espaciado: mtx-list-unstyled + mtx-mb-2 combina como se espera)
  group('list', { unstyled: 'list-style:none;padding:0;margin:0' }),

  // Flex
  group('flex', {
    row: 'flex-direction:row',
    column: 'flex-direction:column',
    'row-reverse': 'flex-direction:row-reverse',
    'column-reverse': 'flex-direction:column-reverse',
    wrap: 'flex-wrap:wrap',
    nowrap: 'flex-wrap:nowrap',
  }, true),
  group('flex', { 1: 'flex:1 1 0%', 'grow-0': 'flex-grow:0', 'grow-1': 'flex-grow:1', 'shrink-0': 'flex-shrink:0', 'shrink-1': 'flex-shrink:1' }),
  group('min-w', { 0: 'min-width:0' }),

  // Alineación
  group('align-items', mapOf(Object.keys(flexAlign), (k) => `align-items:${flexAlign[k]}`), true),
  group('align-self', mapOf(['start', 'center', 'end', 'stretch'], (k) => `align-self:${flexAlign[k]}`), true),
  group('justify-content', mapOf(Object.keys(justify), (k) => `justify-content:${justify[k]}`), true),
  group('align-content', { start: 'align-content:flex-start', center: 'align-content:center', between: 'align-content:space-between' }, true),

  // Gap
  group('gap', mapOf(SPACING, (n) => `gap:${sp(n)}`), true),
  group('row-gap', mapOf(SPACING, (n) => `row-gap:${sp(n)}`), true),
  group('column-gap', mapOf(SPACING, (n) => `column-gap:${sp(n)}`), true),

  // Spacing (margin / padding con propiedades lógicas)
  ...Object.entries(spacingProps).map(([key, props]) => {
    const map = mapOf(SPACING, (n) => props.map((p) => `${p}:${sp(n)}`).join(';'));
    return group(key, map, responsiveSpacing.has(key));
  }),
  ...Object.entries(spacingProps)
    .filter(([key]) => autoSpacing.has(key))
    .map(([key, props]) => group(key, { auto: props.map((p) => `${p}:auto`).join(';') }, responsiveSpacing.has(key))),
  ...Object.entries(legacyAlias).map(([key, prop]) => {
    const map = mapOf(['0', '1', '2', '3', '4'], (n) => `${prop}:${sp(n)}`);
    if (key.startsWith('m')) map.auto = `${prop}:auto`;
    return group(key, map);
  }),

  // Tamaño
  group('w', { 25: 'width:25%', 50: 'width:50%', 75: 'width:75%', 100: 'width:100%', auto: 'width:auto' }),
  group('h', { 100: 'height:100%', auto: 'height:auto' }),
  group('mw', { 100: 'max-width:100%' }),
  group('mh', { 100: 'max-height:100%' }),
  group('vh', { 100: 'height:100vh;height:100dvh' }),
  group('min-vh', { 100: 'min-height:100vh;min-height:100dvh' }),

  // Texto
  group('text', { start: 'text-align:start', center: 'text-align:center', end: 'text-align:end' }, true),
  group('text', {
    nowrap: 'white-space:nowrap',
    wrap: 'white-space:normal',
    truncate: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
    uppercase: 'text-transform:uppercase',
    lowercase: 'text-transform:lowercase',
    capitalize: 'text-transform:capitalize',
    'decoration-none': 'text-decoration:none',
  }),
  group('line-clamp', mapOf(['2', '3'], (n) => `display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:${n};line-clamp:${n};overflow:hidden`)),
  group('fw', { light: 'font-weight:300', regular: 'font-weight:400', medium: 'font-weight:500', bold: 'font-weight:700' }),
  group('tabular', { nums: 'font-variant-numeric:tabular-nums' }),
  group('lh', { 1: 'line-height:1' }),

  // Color
  group('color', {
    'text-primary': 'color:var(--mtx-color-text-primary)',
    'text-secondary': 'color:var(--mtx-color-text-secondary)',
    'text-disabled': 'color:var(--mtx-color-text-disabled)',
    primary: 'color:var(--mtx-color-primary-text)',
    secondary: 'color:var(--mtx-color-secondary-text)',
    success: 'color:var(--mtx-color-success-text)',
    error: 'color:var(--mtx-color-error-text)',
    warning: 'color:var(--mtx-color-warning-text)',
    info: 'color:var(--mtx-color-info-text)',
    inherit: 'color:inherit',
  }),
  group('bg', {
    paper: 'background-color:var(--mtx-color-background-paper)',
    default: 'background-color:var(--mtx-color-background-default)',
    primary: 'background-color:var(--mtx-color-primary);color:var(--mtx-color-primary-contrast)',
    secondary: 'background-color:var(--mtx-color-secondary);color:var(--mtx-color-secondary-contrast)',
    'action-hover': 'background-color:var(--mtx-color-action-hover)',
    'action-selected': 'background-color:var(--mtx-color-action-selected)',
    transparent: 'background-color:transparent',
  }),

  // Posición
  group('position', mapOf(['static', 'relative', 'absolute', 'fixed', 'sticky'], (v) => `position:${v}`)),
  group('sticky', { top: 'position:sticky;top:var(--mtx-app-bar-height,64px);z-index:1020' }),
  group('top', { 0: 'top:0' }),
  group('bottom', { 0: 'bottom:0' }),
  group('start', { 0: 'inset-inline-start:0' }),
  group('end', { 0: 'inset-inline-end:0' }),
  group('left', { 0: 'left:0' }),
  group('right', { 0: 'right:0' }),
  group('inset', { 0: 'inset:0' }),
  group('z', {
    0: 'z-index:0',
    1: 'z-index:1',
    2: 'z-index:2',
    3: 'z-index:3',
    'app-bar': 'z-index:var(--mtx-z-index-app-bar)',
    drawer: 'z-index:var(--mtx-z-index-drawer)',
    modal: 'z-index:var(--mtx-z-index-modal)',
  }),

  // Scroll (anclas y desplazamiento suave)
  group('scroll', { smooth: 'scroll-behavior:smooth', 'mt-app-bar': 'scroll-margin-top:var(--mtx-app-bar-height,64px)' }),

  // Overflow
  group('overflow', { hidden: 'overflow:hidden', auto: 'overflow:auto', visible: 'overflow:visible' }),
  group('overflow-x', { auto: 'overflow-x:auto' }),
  group('overflow-y', { auto: 'overflow-y:auto' }),

  // Borde y radio
  group('border', {
    '': 'border:1px solid var(--mtx-color-divider)',
    top: 'border-top:1px solid var(--mtx-color-divider)',
    bottom: 'border-bottom:1px solid var(--mtx-color-divider)',
    start: 'border-inline-start:1px solid var(--mtx-color-divider)',
    end: 'border-inline-end:1px solid var(--mtx-color-divider)',
    0: 'border:0',
    primary: 'border-color:var(--mtx-color-primary)',
    error: 'border-color:var(--mtx-color-error)',
    divider: 'border-color:var(--mtx-color-divider)',
  }),
  group('rounded', {
    '': 'border-radius:var(--mtx-shape-radius)',
    0: 'border-radius:0',
    2: 'border-radius:calc(var(--mtx-shape-radius) * 2)',
    3: 'border-radius:calc(var(--mtx-shape-radius) * 3)',
    circle: 'border-radius:50%',
    pill: 'border-radius:9999px',
  }),

  // Elevación
  group('elevation', mapOf(['0', '1', '2', '3', '4', '5', '6', '7', '8', '12', '16', '24'], (n) => `box-shadow:var(--mtx-elevation-${n})`)),

  // Varios
  group('pointer-events', { none: 'pointer-events:none' }),
  group('user-select', { none: 'user-select:none' }),
  group('cursor', { pointer: 'cursor:pointer' }),
  group('object', { cover: 'object-fit:cover' }),
];

/** Reglas que no siguen el patrón prefijo-sufijo (bloques literales). */
const RAW = `
/* Accesibilidad */
.mtx-visually-hidden,
.mtx-visually-hidden-focusable:not(:focus):not(:focus-within){position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.mtx-skip-link{position:fixed;top:var(--mtx-spacing-1);left:var(--mtx-spacing-1);z-index:var(--mtx-z-index-tooltip);display:inline-flex;align-items:center;min-height:var(--mtx-size-medium-height);padding:0 var(--mtx-spacing-2);border-radius:var(--mtx-shape-radius);background-color:var(--mtx-color-primary);color:var(--mtx-color-primary-contrast);font:var(--mtx-type-button);letter-spacing:.02857em;text-transform:uppercase;text-decoration:none;box-shadow:none;transform:translateY(calc(-100% - var(--mtx-spacing-2)));transition:transform var(--mtx-duration-shorter) var(--mtx-easing-standard)}
.mtx-skip-link:focus,.mtx-skip-link:focus-visible{transform:none;box-shadow:var(--mtx-elevation-6);outline:var(--mtx-focus-ring-width) solid var(--mtx-color-primary-contrast);outline-offset:-4px}

/* Enlace extendido: hace clicable el ancestro posicionado más cercano */
.mtx-stretched-link::after{position:absolute;inset:0;z-index:1;content:""}
/* Controles por encima del enlace extendido (patrón Bootstrap: z-index sobre el ::after de z-index 1) */
.mtx-stretched-link-above{position:relative!important;z-index:2!important}

/* Desplazamiento suave solo si el usuario no pide reducir el movimiento */
@media (prefers-reduced-motion:reduce){.mtx-scroll-smooth{scroll-behavior:auto!important}}

/* Tipografía como clase pura (sin .mtx-typography ni JS): reinicia márgenes del agente de usuario
   con especificidad 0 para que los modificadores del componente (gutter-bottom...) sigan ganando. */
:where(.mtx-typography--h1,.mtx-typography--h2,.mtx-typography--h3,.mtx-typography--h4,.mtx-typography--h5,.mtx-typography--h6,.mtx-typography--subtitle1,.mtx-typography--subtitle2,.mtx-typography--body1,.mtx-typography--body2,.mtx-typography--caption,.mtx-typography--overline,.mtx-typography--button){margin:0}
`;

/**
 * Serializa una regla con `!important` en cada declaración.
 * @param {string} cls Nombre de clase completo.
 * @param {string} decls Declaraciones separadas por `;`.
 * @returns {string} Regla CSS.
 */
const rule = (cls, decls) => `.${cls}{${decls.split(';').map((d) => `${d}!important`).join(';')}}`;

/**
 * Compone `mtx-{prefix}[-{bp}][-{sufijo}]`.
 * @param {string} prefix Prefijo.
 * @param {string} suffix Sufijo (vacío para la clase base).
 * @param {string} [bp] Infijo de breakpoint.
 * @returns {string} Clase.
 */
const className = (prefix, suffix, bp) => {
  const parts = ['mtx', prefix];
  if (bp) parts.push(bp);
  if (suffix !== '') parts.push(suffix);
  return parts.join('-');
};


/**
 * Genera el CSS completo de utilidades.
 * @returns {string} Contenido de utilities.css.
 */
export function buildUtilitiesCss() {
  const out = [];
  out.push('/* ==========================================================================');
  out.push('   Materix UI — Utilidades (ARCHIVO GENERADO: no editar a mano)');
  out.push('   Fuente: scripts/gen-utilities.mjs · Regenerar con `npm run gen:utilities`.');
  out.push('   Mobile-first: xs sin infijo · sm 600px · md 900px · lg 1200px · xl 1536px.');
  out.push('   ========================================================================== */');
  out.push('');

  for (const g of CONFIG) {
    out.push(Object.entries(g.map).map(([s, d]) => rule(className(g.prefix, String(s)), d)).join('\n'));
  }
  out.push(RAW.trim());

  for (const [bp, min] of Object.entries(BREAKPOINTS)) {
    const lines = [];
    for (const g of CONFIG) {
      if (!g.responsive) continue;
      for (const [s, d] of Object.entries(g.map)) lines.push(rule(className(g.prefix, String(s), bp), d));
    }
    lines.push(rule(`mtx-sticky-${bp}-top`, 'position:sticky;top:var(--mtx-app-bar-height,64px);z-index:1020'));
    out.push(`\n/* ${bp} ≥ ${min}px */\n@media (min-width:${min}px){\n${lines.join('\n')}\n}`);
  }
  return `${out.join('\n')}\n`;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const target = resolve(dirname(fileURLToPath(import.meta.url)), '../src/styles/utilities.css');
  const css = buildUtilitiesCss();
  writeFileSync(target, css);
  console.log(`utilities.css generado (${(css.length / 1024).toFixed(1)} KB)`);
}
