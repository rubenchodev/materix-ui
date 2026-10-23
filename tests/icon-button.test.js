import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/icon-button/icon-button.js';

function createIconButton(attrs = {}) {
  const el = document.createElement('button');
  el.className = 'mtx-icon-button';
  el.setAttribute('data-mtx', 'icon-button');
  el.setAttribute('type', 'button');
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'disabled') {
      el.disabled = v;
    } else {
      el.setAttribute(k, v);
    }
  });
  document.body.appendChild(el);
  return el;
}

describe('IconButton', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = createIconButton({ 'aria-label': 'Buscar' });
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('expone el estado disabled', () => {
    const el = createIconButton({ disabled: true, 'aria-label': 'Buscar' });
    initAll();
    expect(getInstance(el).disabled).toBe(true);
  });

  it('disable() y enable() controlan el atributo nativo', () => {
    const el = createIconButton({ 'aria-label': 'Buscar' });
    initAll();
    const button = getInstance(el);

    button.disable();
    expect(el.disabled).toBe(true);

    button.enable();
    expect(el.disabled).toBe(false);
  });

  it('añade ripple al recibir pointerdown', () => {
    const el = createIconButton({ 'aria-label': 'Buscar' });
    initAll();

    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
    }));

    expect(el.querySelector('.mtx-ripple')).not.toBeNull();
  });

  it('no genera ripple si está deshabilitado', () => {
    const el = createIconButton({ disabled: true, 'aria-label': 'Buscar' });
    initAll();

    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
    }));

    expect(el.querySelector('.mtx-ripple')).toBeNull();
  });

  it('destroy() elimina los listeners de ripple', () => {
    const el = createIconButton({ 'aria-label': 'Buscar' });
    initAll();
    const button = getInstance(el);

    button.destroy();
    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
    }));

    expect(el.querySelector('.mtx-ripple')).toBeNull();
  });
});

describe('IconButton — correcciones de plantillas (A5, A7, A17)', () => {
  const css = readFileSync('src/components/icon-button/icon-button.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('el host no recorta su contenido (Badge visible) y el ripple va en un contenedor interno', () => {
    const host = css.match(/\.mtx-icon-button\s*\{[^}]*\}/)[0];
    expect(host).not.toMatch(/overflow:\s*hidden/);
    const el = createIconButton({ 'aria-label': 'Buscar' });
    initAll();
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 5 }));
    expect(el.querySelector('.mtx-ripple-container > .mtx-ripple')).not.toBeNull();
  });

  it('<a> sin subrayado y SVG a 24px', () => {
    expect(css).toMatch(/\.mtx-icon-button\s*\{[^}]*text-decoration:\s*none/);
    expect(css).toMatch(/\.mtx-icon-button svg\s*\{[^}]*width:\s*24px;[^}]*height:\s*24px/);
  });

  it('data-color="inherit" y data-edge añaden sus modificadores', () => {
    const el = createIconButton({ 'aria-label': 'Menú', 'data-color': 'inherit', 'data-edge': 'start' });
    initAll();
    expect(el.classList.contains('mtx-icon-button--inherit')).toBe(true);
    expect(el.classList.contains('mtx-icon-button--edge-start')).toBe(true);
    expect(css).toMatch(/\.mtx-icon-button--inherit\s*\{\s*--mtx-ic-color:\s*currentColor/);
  });
});
