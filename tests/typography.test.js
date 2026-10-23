import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Typography } from '../src/components/typography/typography.js';

function createTypography(variant = 'h1', text = 'Texto de prueba') {
  const el = document.createElement('div');
  el.className = `mtx-typography mtx-typography--${variant}`;
  el.setAttribute('data-mtx', 'typography');
  el.textContent = text;
  document.body.appendChild(el);
  return el;
}

describe('Typography', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y registra como una instancia de Typography', () => {
    const el = createTypography('h2');
    initAll();
    const typo = getInstance(el);
    expect(typo).toBeInstanceOf(Typography);
    expect(el.classList.contains('mtx-typography--h2')).toBe(true);
  });

  it('aplica alineación y color declarativo', () => {
    const el = document.createElement('h3');
    el.setAttribute('data-mtx', 'typography');
    el.setAttribute('data-align', 'center');
    el.setAttribute('data-color', 'primary');
    el.textContent = 'Subtítulo Centrado';
    document.body.appendChild(el);

    initAll();
    expect(el.classList.contains('mtx-typography--center')).toBe(true);
    expect(el.classList.contains('mtx-typography--color-primary')).toBe(true);
  });
});

describe('Typography — correcciones de plantillas (A2, A22)', () => {
  const css = readFileSync('src/components/typography/typography.css', 'utf8');

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('h1–h6 no tienen margen inferior por defecto; solo con gutter-bottom', () => {
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((v) => {
      const rule = css.match(new RegExp(`\\.mtx-typography--${v}\\s*\\{[^}]*\\}`))[0];
      expect(rule).not.toMatch(/margin/);
    });
    expect(css).toMatch(/\.mtx-typography--gutter-bottom\s*\{\s*margin-bottom:\s*0\.35em/);
  });

  it('data-color admite colores de estado, de texto y disabled', () => {
    const colors = ['error', 'warning', 'info', 'success', 'text-secondary', 'text-primary', 'disabled', 'inherit'];
    colors.forEach((color) => {
      const el = document.createElement('p');
      el.setAttribute('data-mtx', 'typography');
      el.setAttribute('data-color', color);
      document.body.appendChild(el);
    });
    initAll();
    document.querySelectorAll('p').forEach((el) => {
      const cls = `mtx-typography--color-${el.getAttribute('data-color')}`;
      expect(el.classList.contains(cls)).toBe(true);
      expect(css).toContain(`.${cls}`);
    });
  });

  it('data-paragraph añade mtx-typography--paragraph', () => {
    const el = document.createElement('p');
    el.setAttribute('data-mtx', 'typography');
    el.setAttribute('data-paragraph', '');
    document.body.appendChild(el);
    initAll();
    expect(el.classList.contains('mtx-typography--paragraph')).toBe(true);
  });
});

describe('Typography — responsive', () => {
  const css = readFileSync('src/components/typography/typography.css', 'utf8');

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('data-variant-{bp} añade mtx-typography--{bp}-{variante}', () => {
    document.body.innerHTML = '<h2 data-mtx="typography" data-variant="h4" data-variant-md="h3" data-variant-xl="h2">T</h2>';
    initAll();
    const el = document.querySelector('h2');
    ['mtx-typography--h4', 'mtx-typography--md-h3', 'mtx-typography--xl-h2']
      .forEach((c) => expect(el.classList.contains(c)).toBe(true));
  });

  it('data-responsive activa la escala fluida (y "false" no)', () => {
    document.body.innerHTML = '<h1 data-mtx="typography" data-responsive id="a">A</h1><h1 data-mtx="typography" data-responsive="false" id="b">B</h1>';
    initAll();
    expect(document.getElementById('a').classList.contains('mtx-typography--responsive')).toBe(true);
    expect(document.getElementById('b').classList.contains('mtx-typography--responsive')).toBe(false);
  });

  it('el CSS define las variantes por breakpoint dentro de su media query mobile-first', () => {
    [['sm', 600], ['md', 900], ['lg', 1200], ['xl', 1536]].forEach(([bp, min]) => {
      const start = css.indexOf(`@media (min-width: ${min}px)`);
      expect(start).toBeGreaterThan(-1);
      const block = css.slice(start, css.indexOf('}\n', css.indexOf(`.mtx-typography--${bp}-overline`, start)) + 2);
      ['h1', 'h3', 'h6', 'body1', 'caption', 'overline'].forEach((v) => {
        expect(block).toContain(`.mtx-typography--${bp}-${v} { font: var(--mtx-type-${v});`);
      });
    });
  });

  it('la escala fluida redefine los tokens h1–h6 con clamp()', () => {
    const block = css.slice(css.indexOf('.mtx-typography--responsive {'));
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((v) => {
      expect(block).toContain(`--mtx-type-${v}: `);
      expect(block.split(`--mtx-type-${v}: `)[1].split(';')[0]).toContain('clamp(');
    });
  });
});
