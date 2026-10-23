import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/paper/paper.js';

function createPaper(cls = '') {
  const el = document.createElement('div');
  el.className = `mtx-paper ${cls}`.trim();
  el.setAttribute('data-mtx', 'paper');
  document.body.appendChild(el);
  return el;
}

describe('Paper', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = createPaper();
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('se inicializa con una variante de elevación', () => {
    const el = createPaper('mtx-paper--elevation-4');
    initAll();
    expect(getInstance(el)).toBeDefined();
    expect(el.classList.contains('mtx-paper--elevation-4')).toBe(true);
  });

  it('se inicializa con la variante outlined', () => {
    const el = createPaper('mtx-paper--outlined');
    initAll();
    expect(getInstance(el)).toBeDefined();
  });
});