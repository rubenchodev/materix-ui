import { describe, it, expect, beforeEach } from 'vitest';
import { Grid } from '../src/components/grid/grid.js';
import { initAll, getInstance } from '../src/core/registry.js';
import fs from 'node:fs';
import path from 'node:path';

describe('Grid Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('debe inicializarse de forma declarativa con data-mtx="grid"', () => {
    document.body.innerHTML = `
      <div id="grid-root" class="mtx-grid mtx-grid--container mtx-grid--spacing-2" data-mtx="grid">
        <div class="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-6" data-mtx="grid">Col 1</div>
        <div class="mtx-grid mtx-grid--item mtx-grid--xs-12 mtx-grid--md-6" data-mtx="grid">Col 2</div>
      </div>
    `;

    initAll();

    const root = document.getElementById('grid-root');
    const instance = getInstance(root);

    expect(instance).toBeInstanceOf(Grid);
    expect(instance.isContainer).toBe(true);
    expect(instance.isItem).toBe(false);
  });

  it('debe identificar correctamente ítems/columnas con isItem', () => {
    const el = document.createElement('div');
    el.className = 'mtx-grid mtx-grid--item mtx-grid--xs-6';
    const grid = new Grid(el);

    expect(grid.isItem).toBe(true);
    expect(grid.isContainer).toBe(false);
  });

  it('debe cambiar el espaciado dinámicamente con setSpacing', () => {
    const el = document.createElement('div');
    el.className = 'mtx-grid mtx-grid--container mtx-grid--spacing-2';
    const grid = new Grid(el);

    grid.setSpacing(4);

    expect(el.classList.contains('mtx-grid--spacing-4')).toBe(true);
    expect(el.classList.contains('mtx-grid--spacing-2')).toBe(false);
  });

  it('debe actualizar la dirección, justificación y alineación dinámicamente', () => {
    const el = document.createElement('div');
    el.className = 'mtx-grid mtx-grid--container';
    const grid = new Grid(el);

    grid.setDirection('column');
    grid.setJustifyContent('center');
    grid.setAlignItems('flex-end');

    expect(el.classList.contains('mtx-grid--direction-column')).toBe(true);
    expect(el.classList.contains('mtx-grid--justify-center')).toBe(true);
    expect(el.classList.contains('mtx-grid--align-flex-end')).toBe(true);
  });
});

describe('Grid — espaciado con gap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('aplica data-spacing, data-row-spacing, data-column-spacing y variantes responsive', () => {
    document.body.innerHTML = `<div id="g" data-mtx="grid" data-spacing="1" data-spacing-md="3"
      data-row-spacing="2" data-column-spacing-lg="7"><div data-mtx="grid" data-xs="6"></div></div>`;
    initAll();
    const el = document.getElementById('g');
    ['mtx-grid--spacing-1', 'mtx-grid--md-spacing-3', 'mtx-grid--row-spacing-2', 'mtx-grid--lg-column-spacing-7']
      .forEach((c) => expect(el.classList.contains(c), c).toBe(true));
  });

  it('setSpacing por breakpoint no toca el de base ni row/column', () => {
    const el = document.createElement('div');
    el.className = 'mtx-grid mtx-grid--container mtx-grid--spacing-2 mtx-grid--row-spacing-1';
    const grid = new Grid(el);
    grid.setSpacing(4, 'md');
    grid.setColumnSpacing(3);
    ['mtx-grid--spacing-2', 'mtx-grid--row-spacing-1', 'mtx-grid--md-spacing-4', 'mtx-grid--column-spacing-3']
      .forEach((c) => expect(el.classList.contains(c), c).toBe(true));
  });

  it('ignora valores fuera de 0–12 sin lanzar', () => {
    const el = document.createElement('div');
    el.setAttribute('data-spacing', '20');
    expect(() => new Grid(el)).not.toThrow();
    expect(Array.from(el.classList).some((c) => c.includes('spacing'))).toBe(false);
  });

  it('el CSS usa gap, sin márgenes negativos, y descuenta el gap del ancho de columna', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../src/components/grid/grid.css'), 'utf-8');
    expect(css).not.toMatch(/margin:\s*-/);
    expect(css).toMatch(/\.mtx-grid--spacing-7 \{ row-gap: calc\(var\(--mtx-spacing-unit\) \* 7\)/);
    expect(css).toMatch(/\.mtx-grid--xs-6 \{[^}]*calc\(50% - var\(--mtx-grid-parent-column-spacing, 0px\) \* 0\.5\)/);
  });
});

describe('Grid — medios pasos de spacing (0.5, 1.5, 2.5)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('data-spacing / row / column aceptan 0.5, 1.5, 2.5 y la forma 2_5', () => {
    document.body.innerHTML = `<div id="g" data-mtx="grid" data-spacing="2.5" data-row-spacing-md="0.5"
      data-column-spacing="1_5"><div data-mtx="grid" data-xs="6"></div></div>`;
    initAll();
    const el = document.getElementById('g');
    ['mtx-grid--spacing-2_5', 'mtx-grid--md-row-spacing-0_5', 'mtx-grid--column-spacing-1_5']
      .forEach((c) => expect(el.classList.contains(c)).toBe(true));
  });

  it('setSpacing sustituye un medio paso por un entero y rechaza valores fuera de escala', () => {
    document.body.innerHTML = '<div id="g" data-mtx="grid" data-spacing="1.5"></div>';
    initAll();
    const el = document.getElementById('g');
    getInstance(el).setSpacing(3);
    expect(el.classList.contains('mtx-grid--spacing-1_5')).toBe(false);
    expect(el.classList.contains('mtx-grid--spacing-3')).toBe(true);
    getInstance(el).setSpacing('3.5');
    expect(el.classList.contains('mtx-grid--spacing-3')).toBe(true);
  });

  it('el CSS define los medios pasos en xs y en cada breakpoint', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../src/components/grid/grid.css'), 'utf-8');
    ['', 'sm-', 'md-', 'lg-', 'xl-'].forEach((bp) => {
      expect(css).toContain(`.mtx-grid--${bp}spacing-2_5 { row-gap: calc(var(--mtx-spacing-unit) * 2.5); column-gap: calc(var(--mtx-spacing-unit) * 2.5); }`);
      expect(css).toContain(`.mtx-grid--${bp}row-spacing-0_5 { row-gap: calc(var(--mtx-spacing-unit) * 0.5); }`);
      expect(css).toContain(`.mtx-grid--${bp}column-spacing-1_5 > * { --mtx-grid-parent-column-spacing: calc(var(--mtx-spacing-unit) * 1.5); }`);
    });
  });
});
