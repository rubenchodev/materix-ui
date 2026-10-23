import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CssBaseline } from '../src/components/css-baseline/css-baseline.js';
import { initAll, getInstance } from '../src/core/registry.js';

const baseCss = readFileSync(resolve(__dirname, '../src/styles/base.css'), 'utf8');

describe('CssBaseline', () => {
  let style;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
    document.body.removeAttribute('data-mtx');
    document.body.removeAttribute('data-mtx-theme');
    style = document.createElement('style');
    style.textContent = baseCss;
    document.head.appendChild(style);
  });

  afterEach(() => {
    style.remove();
    const instance = getInstance(document.body);
    if (instance) instance.destroy();
  });

  it('se inicializa de forma declarativa y marca el contenedor con mtx-root', () => {
    document.body.innerHTML = '<div id="r" data-mtx="css-baseline"></div>';
    initAll();
    const el = document.getElementById('r');
    expect(getInstance(el)).toBeInstanceOf(CssBaseline);
    expect(el.classList.contains('mtx-root')).toBe(true);
    expect(el.hasAttribute('data-mtx-initialized')).toBe(true);
  });

  it('se inicializa sobre <body>', () => {
    document.body.setAttribute('data-mtx', 'css-baseline');
    initAll();
    expect(getInstance(document.body)).toBeInstanceOf(CssBaseline);
    expect(document.body.classList.contains('mtx-root')).toBe(true);
  });

  it('se inicializa de forma programática conservando las clases existentes', () => {
    const el = document.createElement('section');
    el.className = 'app-shell';
    document.body.appendChild(el);
    const baseline = new CssBaseline(el);
    expect(getInstance(el)).toBe(baseline);
    expect(el.className).toBe('app-shell mtx-root');
  });

  it('es idempotente', () => {
    document.body.innerHTML = '<div id="r" data-mtx="css-baseline"></div>';
    initAll();
    const el = document.getElementById('r');
    const first = getInstance(el);
    initAll();
    expect(getInstance(el)).toBe(first);
    expect(el.className).toBe('mtx-root');
  });

  it('destroy libera la instancia y permite reinicializar', () => {
    document.body.innerHTML = '<div id="r" data-mtx="css-baseline"></div>';
    initAll();
    const el = document.getElementById('r');
    const first = getInstance(el);
    first.destroy();
    expect(first.destroyed).toBe(true);
    expect(getInstance(el)).toBeFalsy();
    expect(el.hasAttribute('data-mtx-initialized')).toBe(false);
    expect(() => first.destroy()).not.toThrow();
    initAll();
    const second = getInstance(el);
    expect(second).toBeInstanceOf(CssBaseline);
    expect(second).not.toBe(first);
  });

  it('aplica color-scheme light por defecto y dark con el tema oscuro', () => {
    document.body.innerHTML = '<div id="r" data-mtx="css-baseline"></div>';
    initAll();
    const el = document.getElementById('r');
    expect(getComputedStyle(el).getPropertyValue('color-scheme')).toBe('light');
    el.setAttribute('data-mtx-theme', 'dark');
    expect(getComputedStyle(el).getPropertyValue('color-scheme')).toBe('dark');
  });

  it('el tema oscuro heredado de un ancestro también aplica color-scheme dark', () => {
    document.body.innerHTML = '<div data-mtx-theme="dark"><div id="r" data-mtx="css-baseline"></div></div>';
    initAll();
    expect(getComputedStyle(document.getElementById('r')).getPropertyValue('color-scheme')).toBe('dark');
  });
});
