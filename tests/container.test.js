import { describe, it, expect, beforeEach } from 'vitest';
import { Container } from '../src/components/container/container.js';
import { initAll, getInstance } from '../src/core/registry.js';

describe('Container', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa de forma declarativa y aplica clases desde data-*', () => {
    document.body.innerHTML = '<main id="c" data-mtx="container" data-max-width="md" data-disable-gutters data-fixed></main>';
    initAll();
    const el = document.getElementById('c');
    expect(getInstance(el)).toBeInstanceOf(Container);
    ['mtx-container', 'mtx-container--md', 'mtx-container--disable-gutters', 'mtx-container--fixed']
      .forEach((c) => expect(el.classList.contains(c), c).toBe(true));
  });

  it('es idempotente', () => {
    document.body.innerHTML = '<div id="c" data-mtx="container"></div>';
    initAll();
    const first = getInstance(document.getElementById('c'));
    initAll();
    expect(getInstance(document.getElementById('c'))).toBe(first);
    expect(document.getElementById('c').className).toBe('mtx-container');
  });

  it('data-max-width="false" produce un contenedor fluido', () => {
    const el = document.createElement('div');
    el.setAttribute('data-max-width', 'false');
    new Container(el);
    expect(el.classList.contains('mtx-container--fluid')).toBe(true);
  });

  it('setMaxWidth sustituye el tope y valida el valor', () => {
    const el = document.createElement('div');
    const c = new Container(el);
    c.setMaxWidth('sm');
    c.setMaxWidth('xl');
    expect(el.classList.contains('mtx-container--sm')).toBe(false);
    expect(el.classList.contains('mtx-container--xl')).toBe(true);
    c.setMaxWidth(false);
    expect(el.classList.contains('mtx-container--fluid')).toBe(true);
    expect(() => c.setMaxWidth('xxl')).toThrow(RangeError);
  });

  it('un data-max-width inválido no rompe la inicialización', () => {
    document.body.innerHTML = '<div id="c" data-mtx="container" data-max-width="huge"></div>';
    expect(() => initAll()).not.toThrow();
    expect(document.getElementById('c').classList.contains('mtx-container')).toBe(true);
  });

  it('setGutters y setFixed alternan sus clases; data-fixed="false" no aplica', () => {
    const el = document.createElement('div');
    el.setAttribute('data-fixed', 'false');
    const c = new Container(el);
    expect(el.classList.contains('mtx-container--fixed')).toBe(false);
    c.setFixed(true);
    c.setGutters(false);
    expect(el.classList.contains('mtx-container--fixed')).toBe(true);
    expect(el.classList.contains('mtx-container--disable-gutters')).toBe(true);
    c.setGutters(true);
    expect(el.classList.contains('mtx-container--disable-gutters')).toBe(false);
  });
});
