import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/divider/divider.js';

function createDivider(cls = '') {
  const el = document.createElement('hr');
  el.className = `mtx-divider ${cls}`.trim();
  el.setAttribute('data-mtx', 'divider');
  document.body.appendChild(el);
  return el;
}

describe('Divider', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = createDivider();
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('se inicializa con la variante vertical', () => {
    const el = createDivider('mtx-divider--vertical');
    initAll();
    expect(getInstance(el)).toBeDefined();
    expect(el.classList.contains('mtx-divider--vertical')).toBe(true);
  });

  it('se inicializa con la variante middle', () => {
    const el = createDivider('mtx-divider--middle');
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('soporta divisor con texto y genera la estructura con mtx-divider__text', () => {
    const div = document.createElement('div');
    div.setAttribute('data-mtx', 'divider');
    div.textContent = 'O continuar con';
    document.body.appendChild(div);

    initAll();
    expect(div.classList.contains('mtx-divider--text')).toBe(true);
    const textSpan = div.querySelector('.mtx-divider__text');
    expect(textSpan).not.toBeNull();
    expect(textSpan.textContent).toBe('O continuar con');
  });
  it('un <li> vacío dentro de <ul> no usa role=separator y queda oculto (axe list)', () => {
    document.body.innerHTML = '<ul data-mtx="list"><li>A</li><li data-mtx="divider" data-variant="inset"></li><li>B</li></ul>';
    initAll();
    const li = document.querySelector('li.mtx-divider');
    expect(li.hasAttribute('role')).toBe(false);
    expect(li.getAttribute('aria-hidden')).toBe('true');
    expect(li.classList.contains('mtx-divider--inset')).toBe(true);
  });

  it('un <li> con texto dentro de una lista sigue siendo listitem legible', () => {
    document.body.innerHTML = '<ol><li data-mtx="divider">Más</li></ol>';
    initAll();
    const li = document.querySelector('li.mtx-divider');
    expect(li.hasAttribute('role')).toBe(false);
    expect(li.hasAttribute('aria-hidden')).toBe(false);
  });

  it('fuera de una lista mantiene role=separator', () => {
    document.body.innerHTML = '<div data-mtx="divider"></div>';
    initAll();
    expect(document.querySelector('.mtx-divider').getAttribute('role')).toBe('separator');
  });
});