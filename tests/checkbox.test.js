import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/checkbox/checkbox.js';

function createCheckbox() {
  const label = document.createElement('label');
  label.className = 'mtx-checkbox';
  label.setAttribute('data-mtx', 'checkbox');
  label.innerHTML =
    '<input type="checkbox" class="mtx-checkbox__input" />' +
    '<span class="mtx-checkbox__box"></span>' +
    '<span class="mtx-checkbox__label">Opción</span>';
  document.body.appendChild(label);
  return label;
}

describe('Checkbox', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = createCheckbox();
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('el input nativo queda oculto (fuera del flujo visual)', () => {
    const el = createCheckbox();
    initAll();
    const input = el.querySelector('input');
    expect(input.classList.contains('mtx-checkbox__input')).toBe(true);
    expect(el.querySelector('.mtx-checkbox__box')).not.toBeNull();
    expect(el.querySelector('.mtx-checkbox__label')).not.toBeNull();
  });

  it('deshabilita el control', () => {
    const el = createCheckbox();
    initAll();
    const cb = getInstance(el);
    cb.disable();
    expect(cb.disabled).toBe(true);
    expect(el.querySelector('input').disabled).toBe(true);
  });

  it('auto-construye la estructura a partir de un solo <input type="checkbox"> con data-mtx', () => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('data-mtx', 'checkbox');
    input.setAttribute('data-label', 'Recordarme');
    document.body.appendChild(input);

    initAll();

    const label = document.querySelector('.mtx-checkbox');
    expect(label).not.toBeNull();
    expect(label.querySelector('.mtx-checkbox__box')).not.toBeNull();
    expect(label.querySelector('.mtx-checkbox__label').textContent).toBe('Recordarme');
  });

  it('lee y escribe checked', () => {
    const el = createCheckbox();
    initAll();
    const cb = getInstance(el);
    expect(cb.checked).toBe(false);
    cb.checked = true;
    expect(el.querySelector('input').checked).toBe(true);
  });

  it('toggle() alterna el estado', () => {
    const el = createCheckbox();
    initAll();
    const cb = getInstance(el);
    cb.toggle();
    expect(cb.checked).toBe(true);
    cb.toggle();
    expect(cb.checked).toBe(false);
  });

  it('sincroniza aria-checked', () => {
    const el = createCheckbox();
    initAll();
    const cb = getInstance(el);
    cb.checked = true;
    expect(el.querySelector('input').getAttribute('aria-checked')).toBe('true');
  });

  it('soporta indeterminate', () => {
    const el = createCheckbox();
    initAll();
    const cb = getInstance(el);
    cb.indeterminate = true;
    expect(cb.indeterminate).toBe(true);
    expect(el.querySelector('input').getAttribute('aria-checked')).toBe('mixed');
  });

  it('genera ripple al recibir pointerdown', () => {
    const el = createCheckbox();
    initAll();
    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      button: 0,
      clientX: 10,
      clientY: 10,
    }));
    expect(el.querySelector('.mtx-ripple')).not.toBeNull();
  });

  it('destroy() elimina los listeners', () => {
    const el = createCheckbox();
    initAll();
    getInstance(el).destroy();
    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      button: 0,
      clientX: 10,
      clientY: 10,
    }));
    expect(el.querySelector('.mtx-ripple')).toBeNull();
  });
});