import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

const tokens = readFileSync('src/styles/tokens.css', 'utf8');
const PALETTE = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

/**
 * Extrae las declaraciones de los bloques cuyo selector cumple el predicado.
 * @param {(selector: string) => boolean} match Predicado sobre el selector.
 * @returns {Record<string, string>} Mapa propiedad → valor.
 */
function declarations(match) {
  const out = {};
  for (const [, selector, body] of tokens.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!match(selector.replace(/\/\*[\s\S]*?\*\//g, '').trim())) continue;
    for (const [, prop, value] of body.matchAll(/(--mtx-[\w-]+)\s*:\s*([^;]+);/g)) out[prop] = value.trim();
  }
  return out;
}

const light = declarations((s) => s === ':root');
const dark = { ...light, ...declarations((s) => s === "[data-mtx-theme='dark']") };
const muiLight = { ...light, ...declarations((s) => s === "[data-mtx-contrast='mui']") };
const muiDark = { ...dark, ...declarations((s) => s.startsWith("[data-mtx-contrast='mui'][data-mtx-theme='dark']")) };
const aaLight = { ...light, ...declarations((s) => s === "[data-mtx-contrast='aa']") };
const aaDark = { ...dark, ...declarations((s) => s.startsWith("[data-mtx-contrast='aa'][data-mtx-theme='dark']")) };

const hex = (h) => {
  const full = h.length === 4 ? '#' + [...h.slice(1)].map((d) => d + d).join('') : h;
  return [1, 3, 5].map((i) => parseInt(full.slice(i, i + 2), 16)).concat(1);
};

/**
 * Resuelve un valor de color (hex, rgba, var() y color-mix en srgb) a [r, g, b, a].
 * @param {string} value Valor CSS.
 * @param {Record<string, string>} scope Tokens del tema.
 * @returns {number[]} Color RGBA.
 */
function resolve(value, scope) {
  value = value.trim();
  const v = value.match(/^var\((--[\w-]+)\)$/);
  if (v) return resolve(scope[v[1]], scope);
  if (value.startsWith('#')) return hex(value);
  const rgba = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) { const p = rgba[1].split(',').map(Number); return p.length === 3 ? p.concat(1) : p; }
  const mix = value.match(/^color-mix\(in srgb, (.+) (\d+)%, (.+)\)$/);
  if (mix) {
    const a = resolve(mix[1], scope); const b = resolve(mix[3], scope); const t = Number(mix[2]) / 100;
    return [0, 1, 2].map((i) => a[i] * t + b[i] * (1 - t)).concat(1);
  }
  throw new Error(`Valor no soportado: ${value}`);
}

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const ratio = (fg, bg) => { const a = lum(over(fg, bg)); const b = lum(bg); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };

describe('Contraste de color (AA por defecto y opt-out MUI)', () => {
  const BGS = ['background-paper', 'background-default'];
  const MUI_LIGHT = { warning: '#ed6c02', info: '#0288d1', error: '#d32f2f', success: '#2e7d32' };

  /**
   * Comprueba -text ≥ 4.5:1 sobre papel y fondo y -contrast ≥ 4.5:1 sobre el color.
   * @param {Record<string, string>} scope Tokens del tema.
   */
  const expectAA = (scope) => {
    PALETTE.forEach((c) => {
      const text = resolve(`var(--mtx-color-${c}-text)`, scope);
      BGS.forEach((bg) => expect(ratio(text, resolve(`var(--mtx-color-${bg})`, scope)), `${c}-text / ${bg}`).toBeGreaterThanOrEqual(4.5));
      const main = resolve(`var(--mtx-color-${c})`, scope);
      expect(ratio(resolve(`var(--mtx-color-${c}-contrast)`, scope), main), `${c}-contrast`).toBeGreaterThanOrEqual(4.5);
    });
  };

  it('por defecto (claro): -text y -contrast ≥ 4.5:1', () => expectAA(light));
  it('por defecto (oscuro): -text y -contrast ≥ 4.5:1', () => expectAA(dark));
  it('el alias data-mtx-contrast="aa" mantiene ≥ 4.5:1 (claro y oscuro)', () => { expectAA(aaLight); expectAA(aaDark); });

  [['claro', light], ['oscuro', dark]].forEach(([name, scope]) => {
    it(`por defecto (${name}): error-text ≥ 4.5:1 sobre el fondo de los campos filled (reposo y hover)`, () => {
      const paper = resolve('var(--mtx-color-background-paper)', scope);
      ['input-filled', 'input-filled-hover'].forEach((t) => {
        const bg = over(resolve(`var(--mtx-color-${t})`, scope), paper);
        expect(ratio(resolve('var(--mtx-color-error-text)', scope), bg), t).toBeGreaterThanOrEqual(4.5);
      });
    });
  });

  it('los fondos de marca siguen siendo los de MUI', () => {
    Object.entries(MUI_LIGHT).forEach(([c, v]) => expect(light[`--mtx-color-${c}`]).toBe(v));
  });

  it('declara el opt-out [data-mtx-contrast="mui"] para claro y oscuro (también anidados)', () => {
    expect(tokens).toContain("[data-mtx-contrast='mui'] {");
    expect(tokens).toContain("[data-mtx-contrast='mui'] [data-mtx-theme='dark']");
    expect(tokens).toContain("[data-mtx-theme='dark'] [data-mtx-contrast='mui']");
  });

  it('data-mtx-contrast="mui" restaura los valores exactos de MUI', () => {
    PALETTE.forEach((c) => {
      expect(resolve(`var(--mtx-color-${c}-text)`, muiLight), `${c} claro`).toEqual(resolve(`var(--mtx-color-${c})`, muiLight));
      expect(resolve(`var(--mtx-color-${c}-text)`, muiDark), `${c} oscuro`).toEqual(resolve(`var(--mtx-color-${c})`, muiDark));
    });
    expect(muiLight['--mtx-color-warning-contrast']).toBe('#ffffff');
    expect(muiLight['--mtx-color-info-contrast']).toBe('#ffffff');
    expect(muiLight['--mtx-color-error-contrast']).toBe('#ffffff');
    expect(muiDark['--mtx-color-error-contrast']).toBe('#ffffff');
    expect(muiDark['--mtx-color-warning-contrast']).toBe('rgba(0, 0, 0, 0.87)');
    // En modo MUI warning sobre blanco queda por debajo de AA (motivo del cambio de valor por defecto).
    expect(ratio(resolve('var(--mtx-color-warning-text)', muiLight), resolve('var(--mtx-color-background-paper)', muiLight))).toBeLessThan(4.5);
  });

  it('los componentes consumen los tokens -text', () => {
    const read = (n) => readFileSync(`src/components/${n}/${n}.css`, 'utf8');
    PALETTE.forEach((c) => {
      expect(read('button')).toContain(`--mtx-btn-color: var(--mtx-color-${c}-text)`);
      expect(read('chip')).toMatch(new RegExp(`mtx-chip--${c}\\.mtx-chip--outlined[^}]*color: var\\(--mtx-color-${c}-text\\)`));
      expect(read('link')).toContain(`.mtx-link--color-${c} { color: var(--mtx-color-${c}-text)`);
      expect(read('typography')).toContain(`.mtx-typography--color-${c} { color: var(--mtx-color-${c}-text)`);
      expect(read('toggle-button')).toMatch(new RegExp(`mtx-toggle-button--${c} +\\{ --mtx-tb-color: var\\(--mtx-color-${c}-text\\)`));
    });
    ['success', 'info', 'warning', 'error'].forEach((s) => {
      expect(read('alert')).toContain(`--mtx-alert-accent: var(--mtx-color-${s}-text)`);
    });
  });
});
