import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Button } from '../src/components/button/button.js';
import { ButtonGroup } from '../src/components/button-group/button-group.js';

function mount(html) {
  document.body.innerHTML = html;
  initAll();
  return document.body.firstElementChild;
}

describe('ButtonGroup', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('convierte hijos simples en Button con variante outlined por defecto', () => {
    const el = mount('<div data-mtx="button-group" data-label="Opciones"><button>Uno</button><button>Dos</button><button>Tres</button></div>');
    expect(getInstance(el)).toBeInstanceOf(ButtonGroup);
    expect(el.classList.contains('mtx-button-group')).toBe(true);
    expect(el.classList.contains('mtx-button-group--outlined')).toBe(true);
    expect(el.classList.contains('mtx-button-group--horizontal')).toBe(true);
    expect(el.getAttribute('role')).toBe('group');
    expect(el.getAttribute('aria-label')).toBe('Opciones');
    const buttons = el.querySelectorAll('button');
    buttons.forEach((b) => {
      expect(b.classList.contains('mtx-button')).toBe(true);
      expect(b.classList.contains('mtx-button--outlined')).toBe(true);
      expect(b.getAttribute('type')).toBe('button');
      expect(getInstance(b)).toBeInstanceOf(Button);
    });
    expect(buttons[0].classList.contains('mtx-button-group__first')).toBe(true);
    expect(buttons[1].classList.contains('mtx-button-group__middle')).toBe(true);
    expect(buttons[2].classList.contains('mtx-button-group__last')).toBe(true);
  });

  it('hereda variante, tamaño, color y disable-elevation; el hijo puede sobrescribir', () => {
    const el = mount(`<div data-mtx="button-group" data-variant="contained" data-size="small" data-color="secondary" data-disable-elevation>
      <button>A</button><button class="mtx-button--text" data-color="error" data-size="large">B</button></div>`);
    const [a, b] = el.querySelectorAll('button');
    expect(el.classList.contains('mtx-button-group--contained')).toBe(true);
    expect(el.classList.contains('mtx-button-group--disable-elevation')).toBe(true);
    expect(a.classList.contains('mtx-button--contained')).toBe(true);
    expect(a.classList.contains('mtx-button--small')).toBe(true);
    expect(a.classList.contains('mtx-button--secondary')).toBe(true);
    expect(a.classList.contains('mtx-button--disable-elevation')).toBe(true);
    expect(b.classList.contains('mtx-button--text')).toBe(true);
    expect(b.classList.contains('mtx-button--contained')).toBe(false);
    expect(b.classList.contains('mtx-button--large')).toBe(true);
    expect(b.classList.contains('mtx-button--error')).toBe(true);
    expect(b.classList.contains('mtx-button--secondary')).toBe(false);
  });

  it('role=toolbar declarado por el autor conserva aria-orientation vertical', () => {
    const el = mount('<div data-mtx="button-group" role="toolbar" data-orientation="vertical"><button>A</button></div>');
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('orientación vertical y ancho completo', () => {
    const el = mount('<div data-mtx="button-group" data-orientation="vertical" data-full-width><button>A</button><button>B</button></div>');
    expect(el.classList.contains('mtx-button-group--vertical')).toBe(true);
    // role=group no admite aria-orientation (axe aria-allowed-attr).
    expect(el.getAttribute('role')).toBe('group');
    expect(el.hasAttribute('aria-orientation')).toBe(false);
    expect(el.classList.contains('mtx-button-group--full-width')).toBe(true);
    expect(el.querySelector('button').classList.contains('mtx-button--full-width')).toBe(true);
  });

  it('disable()/enable() respetan los botones deshabilitados por el autor', () => {
    const el = mount('<div data-mtx="button-group"><button>A</button><button disabled>B</button><a href="#x">C</a></div>');
    const group = getInstance(el);
    const [a, b] = el.querySelectorAll('button');
    const link = el.querySelector('a');
    group.disable();
    expect(group.disabled).toBe(true);
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(a.disabled).toBe(true);
    expect(link.getAttribute('aria-disabled')).toBe('true');
    group.enable();
    expect(a.disabled).toBe(false);
    expect(b.disabled).toBe(true);
    expect(link.hasAttribute('aria-disabled')).toBe(false);
    expect(el.hasAttribute('aria-disabled')).toBe(false);
  });

  it('data-disabled deshabilita al iniciar', () => {
    const el = mount('<div data-mtx="button-group" data-disabled><button>A</button><button>B</button></div>');
    expect(Array.from(el.querySelectorAll('button')).every((b) => b.disabled)).toBe(true);
  });

  it('refresh() prepara botones añadidos después', () => {
    const el = mount('<div data-mtx="button-group" data-variant="text"><button>A</button></div>');
    const first = el.querySelector('button');
    expect(first.classList.contains('mtx-button-group__first')).toBe(true);
    expect(first.classList.contains('mtx-button-group__last')).toBe(true);
    const extra = document.createElement('button');
    extra.textContent = 'B';
    el.appendChild(extra);
    getInstance(el).refresh();
    expect(extra.classList.contains('mtx-button--text')).toBe(true);
    expect(first.classList.contains('mtx-button-group__last')).toBe(false);
    expect(extra.classList.contains('mtx-button-group__last')).toBe(true);
  });

  it('respeta la sintaxis BEM y es idempotente', () => {
    const el = mount(`<div class="mtx-button-group mtx-button-group--contained" role="group" aria-label="x" data-mtx="button-group">
      <button class="mtx-button mtx-button--contained" data-mtx="button">A</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button">B</button></div>`);
    const instance = getInstance(el);
    expect(instance.variant).toBe('contained');
    initAll();
    expect(getInstance(el)).toBe(instance);
    expect(el.querySelectorAll('.mtx-button--outlined').length).toBe(0);
  });
});
