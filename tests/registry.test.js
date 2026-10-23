import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentBase } from '../src/core/component-base.js';
import {
  registerComponent,
  initAll,
  initElement,
  init,
  getInstance,
} from '../src/core/registry.js';

class FakeComponent extends ComponentBase {}

describe('registry', () => {
  beforeEach(() => {
    registerComponent('fake', FakeComponent);
    document.body.innerHTML = '';
  });

  it('inicializa un elemento con data-mtx', () => {
    const el = document.createElement('div');
    el.setAttribute('data-mtx', 'fake');
    document.body.appendChild(el);

    const instance = initElement(el);
    expect(instance).toBeInstanceOf(FakeComponent);
    expect(getInstance(el)).toBe(instance);
    expect(el.hasAttribute('data-mtx-initialized')).toBe(true);
  });

  it('es idempotente: no crea instancias duplicadas', () => {
    const el = document.createElement('div');
    el.setAttribute('data-mtx', 'fake');
    document.body.appendChild(el);

    const first = initElement(el);
    const second = initElement(el);
    expect(first).toBe(second);
  });

  it('initAll inicializa todos los elementos del contenedor', () => {
    const container = document.createElement('div');
    for (let i = 0; i < 3; i += 1) {
      const el = document.createElement('div');
      el.setAttribute('data-mtx', 'fake');
      container.appendChild(el);
    }
    document.body.appendChild(container);

    initAll(container);
    expect(getInstance(container.children[0])).toBeInstanceOf(FakeComponent);
    expect(getInstance(container.children[1])).toBeInstanceOf(FakeComponent);
    expect(getInstance(container.children[2])).toBeInstanceOf(FakeComponent);
  });

  it('initAll es idempotente sobre el documento completo', () => {
    const el = document.createElement('div');
    el.setAttribute('data-mtx', 'fake');
    document.body.appendChild(el);

    initAll();
    initAll();
    expect(getInstance(el)).toBeInstanceOf(FakeComponent);
  });

  it('devuelve null para componentes no registrados', () => {
    const el = document.createElement('div');
    el.setAttribute('data-mtx', 'desconocido');
    document.body.appendChild(el);

    expect(initElement(el)).toBeNull();
  });

  it('init(el) e init(el, name) inicializan individualmente desde JS', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    const instance = init(el, 'fake');
    expect(instance).toBeInstanceOf(FakeComponent);
    expect(el.getAttribute('data-mtx')).toBe('fake');
    expect(getInstance(el)).toBe(instance);
  });
});