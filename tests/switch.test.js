import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/switch/switch.js';

function createSwitch() {
  const label = document.createElement('label');
  label.className = 'mtx-switch';
  label.setAttribute('data-mtx', 'switch');
  label.innerHTML =
    '<input type="checkbox" class="mtx-switch__input" />' +
    '<span class="mtx-switch__track"><span class="mtx-switch__thumb"></span></span>' +
    '<span class="mtx-switch__label">Wifi</span>';
  document.body.appendChild(label);
  return label;
}

describe('Switch', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y puede obtenerse del registro', () => {
    const el = createSwitch();
    initAll();
    expect(getInstance(el)).toBeDefined();
  });

  it('el input nativo queda oculto (fuera del flujo visual)', () => {
    const el = createSwitch();
    initAll();
    const input = el.querySelector('input');
    expect(input.classList.contains('mtx-switch__input')).toBe(true);
    expect(el.querySelector('.mtx-switch__track')).not.toBeNull();
    expect(el.querySelector('.mtx-switch__thumb')).not.toBeNull();
  });

  it('lee y escribe checked', () => {
    const el = createSwitch();
    initAll();
    const sw = getInstance(el);
    expect(sw.checked).toBe(false);
    sw.checked = true;
    expect(el.querySelector('input').checked).toBe(true);
  });

  it('toggle() alterna el estado', () => {
    const el = createSwitch();
    initAll();
    const sw = getInstance(el);
    sw.toggle();
    expect(sw.checked).toBe(true);
    sw.toggle();
    expect(sw.checked).toBe(false);
  });

  it('genera ripple al recibir pointerdown', () => {
    const el = createSwitch();
    initAll();
    el.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      button: 0,
      clientX: 10,
      clientY: 10,
    }));
    expect(el.querySelector('.mtx-ripple')).not.toBeNull();
  });
});