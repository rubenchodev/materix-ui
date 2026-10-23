import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Fab } from '../src/components/fab/fab.js';

function createFab(attrs = {}, content = '<span class="material-icons">add</span>') {
  const button = document.createElement('button');
  button.className = 'mtx-fab';
  button.setAttribute('data-mtx', 'fab');
  button.innerHTML = content;
  Object.entries(attrs).forEach(([k, v]) => button.setAttribute(k, v));
  document.body.appendChild(button);
  return button;
}

describe('Fab (Floating Action Button)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa automáticamente vía data-mtx="fab"', () => {
    const el = createFab();
    initAll();
    const instance = getInstance(el);
    expect(instance).toBeInstanceOf(Fab);
  });

  it('aplica las variantes de tamaño y color', () => {
    const el = createFab({ 'data-size': 'small', 'data-color': 'secondary' });
    initAll();
    const instance = getInstance(el);

    expect(el.classList.contains('mtx-fab--small')).toBe(true);
    expect(el.classList.contains('mtx-fab--secondary')).toBe(true);

    instance.size = 'medium';
    expect(el.classList.contains('mtx-fab--medium')).toBe(true);

    instance.color = 'error';
    expect(el.classList.contains('mtx-fab--error')).toBe(true);
  });

  it('soporta la variante extendida', () => {
    const el = createFab({ 'data-variant': 'extended' }, '<span class="material-icons">add</span><span>CREAR</span>');
    initAll();
    expect(el.classList.contains('mtx-fab--extended')).toBe(true);
  });

  it('permite habilitar y deshabilitar el botón', () => {
    const el = createFab();
    initAll();
    const instance = getInstance(el);

    expect(instance.disabled).toBe(false);

    instance.disable();
    expect(instance.disabled).toBe(true);
    expect(el.disabled).toBe(true);

    instance.enable();
    expect(instance.disabled).toBe(false);
    expect(el.disabled).toBe(false);
  });
});
