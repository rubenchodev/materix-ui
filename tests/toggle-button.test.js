import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { ToggleButton, ToggleButtonGroup } from '../src/components/toggle-button/toggle-button.js';

const click = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

describe('ToggleButton', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('auto-construye desde un único <button> con icono, aria-pressed y clases', () => {
    document.body.innerHTML = '<button data-mtx="toggle-button" data-value="bold" data-icon="format_bold" data-size="small" data-color="primary" aria-label="Bold"></button>';
    initAll();
    const el = document.querySelector('button');
    const btn = getInstance(el);
    expect(btn).toBeInstanceOf(ToggleButton);
    expect(el.classList.contains('mtx-toggle-button')).toBe(true);
    expect(el.classList.contains('mtx-toggle-button--small')).toBe(true);
    expect(el.classList.contains('mtx-toggle-button--primary')).toBe(true);
    expect(el.getAttribute('type')).toBe('button');
    expect(el.getAttribute('aria-pressed')).toBe('false');
    const icon = el.querySelector('.material-icons');
    expect(icon.textContent).toBe('format_bold');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(btn.value).toBe('bold');
  });

  it('standalone: alterna al hacer clic y emite mtx:toggle-button:change', () => {
    document.body.innerHTML = '<button data-mtx="toggle-button" data-value="fav" data-icon="star" aria-label="Favorite"></button>';
    initAll();
    const el = document.querySelector('button');
    const handler = vi.fn();
    el.addEventListener('mtx:toggle-button:change', handler);
    click(el);
    expect(el.getAttribute('aria-pressed')).toBe('true');
    expect(handler.mock.calls[0][0].detail).toEqual({ selected: true, value: 'fav' });
    click(el);
    expect(getInstance(el).selected).toBe(false);
  });

  it('data-selected, API selected/toggle y disable/enable', () => {
    document.body.innerHTML = '<button data-mtx="toggle-button" data-selected>Wifi</button>';
    initAll();
    const el = document.querySelector('button');
    const btn = getInstance(el);
    expect(btn.selected).toBe(true);
    expect(btn.value).toBe('Wifi');
    btn.selected = false;
    expect(el.getAttribute('aria-pressed')).toBe('false');
    expect(btn.toggle()).toBe(true);
    btn.disable();
    expect(el.disabled).toBe(true);
    expect(btn.disabled).toBe(true);
    btn.enable();
    expect(btn.disabled).toBe(false);
  });

  it('data-disabled deshabilita el botón al iniciar', () => {
    document.body.innerHTML = '<button data-mtx="toggle-button" data-disabled data-icon="star" aria-label="Star"></button>';
    initAll();
    expect(document.querySelector('button').disabled).toBe(true);
  });

  it('respeta la sintaxis BEM y el icono existente', () => {
    document.body.innerHTML = '<button class="mtx-toggle-button mtx-toggle-button--selected" data-mtx="toggle-button" data-icon="x" aria-label="Grid"><span class="material-icons" aria-hidden="true">grid_view</span></button>';
    initAll();
    const el = document.querySelector('button');
    expect(el.querySelectorAll('.material-icons').length).toBe(1);
    expect(el.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('ToggleButtonGroup', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const exclusiveMarkup = (extra = '') => `
    <div data-mtx="toggle-button-group" data-exclusive data-value="left" aria-label="Alignment" ${extra}>
      <button data-value="left" data-icon="format_align_left" aria-label="Left"></button>
      <button data-value="center" data-icon="format_align_center" aria-label="Center"></button>
      <button data-value="right" data-icon="format_align_right" aria-label="Right"></button>
      <button data-value="justify" data-icon="format_align_justify" aria-label="Justify" disabled></button>
    </div>`;

  it('inicializa los hijos, role="group" y el valor declarativo', () => {
    document.body.innerHTML = exclusiveMarkup('data-size="small" data-color="primary"');
    initAll();
    const groupEl = document.querySelector('[data-mtx="toggle-button-group"]');
    const group = getInstance(groupEl);
    expect(group).toBeInstanceOf(ToggleButtonGroup);
    expect(groupEl.getAttribute('role')).toBe('group');
    const buttons = groupEl.querySelectorAll('button');
    buttons.forEach((b) => {
      expect(b.hasAttribute('data-mtx-initialized')).toBe(true);
      expect(b.classList.contains('mtx-toggle-button--small')).toBe(true);
      expect(b.classList.contains('mtx-toggle-button--primary')).toBe(true);
    });
    expect(group.value).toBe('left');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('exclusivo: selecciona uno, deselecciona al repetir y emite el evento', () => {
    document.body.innerHTML = exclusiveMarkup();
    initAll();
    const groupEl = document.querySelector('.mtx-toggle-button-group');
    const group = getInstance(groupEl);
    const handler = vi.fn();
    groupEl.addEventListener('mtx:toggle-button-group:change', handler);
    const [left, center] = groupEl.querySelectorAll('button');
    click(center.querySelector('.material-icons'));
    expect(group.value).toBe('center');
    expect(left.getAttribute('aria-pressed')).toBe('false');
    expect(handler.mock.calls[0][0].detail.value).toBe('center');
    click(center);
    expect(group.value).toBe(null);
    expect(handler.mock.calls[1][0].detail.value).toBe(null);
  });

  it('data-enforce-value-set impide quedarse sin valor', () => {
    document.body.innerHTML = exclusiveMarkup('data-enforce-value-set');
    initAll();
    const groupEl = document.querySelector('.mtx-toggle-button-group');
    const handler = vi.fn();
    groupEl.addEventListener('mtx:toggle-button-group:change', handler);
    click(groupEl.querySelector('button'));
    expect(getInstance(groupEl).value).toBe('left');
    expect(handler).not.toHaveBeenCalled();
  });

  it('múltiple: devuelve un array en orden del DOM y acepta valor separado por comas', () => {
    document.body.innerHTML = `
      <div data-mtx="toggle-button-group" data-value="italic, bold" aria-label="Formatting">
        <button data-value="bold" data-icon="format_bold" aria-label="Bold"></button>
        <button data-value="italic" data-icon="format_italic" aria-label="Italic"></button>
        <button data-value="underlined" data-icon="format_underlined" aria-label="Underline"></button>
      </div>`;
    initAll();
    const groupEl = document.querySelector('.mtx-toggle-button-group');
    const group = getInstance(groupEl);
    expect(group.value).toEqual(['bold', 'italic']);
    const handler = vi.fn();
    groupEl.addEventListener('mtx:toggle-button-group:change', handler);
    click(groupEl.querySelectorAll('button')[2]);
    expect(handler.mock.calls[0][0].detail.value).toEqual(['bold', 'italic', 'underlined']);
    click(groupEl.querySelectorAll('button')[0]);
    expect(group.value).toEqual(['italic', 'underlined']);
    group.value = [];
    expect(group.value).toEqual([]);
    group.value = 'bold';
    expect(group.value).toEqual(['bold']);
  });

  it('setter exclusivo no emite eventos y solo marca un botón', () => {
    document.body.innerHTML = exclusiveMarkup();
    initAll();
    const groupEl = document.querySelector('.mtx-toggle-button-group');
    const group = getInstance(groupEl);
    const handler = vi.fn();
    groupEl.addEventListener('mtx:toggle-button-group:change', handler);
    group.value = ['right', 'center'];
    expect(group.value).toBe('right');
    expect(groupEl.querySelectorAll('[aria-pressed="true"]').length).toBe(1);
    expect(handler).not.toHaveBeenCalled();
  });

  it('ignora los botones deshabilitados y navega con flechas, Home y End', () => {
    document.body.innerHTML = exclusiveMarkup();
    initAll();
    const groupEl = document.querySelector('.mtx-toggle-button-group');
    const [left, center, right, justify] = groupEl.querySelectorAll('button');
    click(justify);
    expect(getInstance(groupEl).value).toBe('left');
    left.focus();
    key(left, 'ArrowRight');
    expect(document.activeElement).toBe(center);
    key(center, 'End');
    expect(document.activeElement).toBe(right);
    key(right, 'ArrowRight');
    expect(document.activeElement).toBe(left);
    key(left, 'ArrowLeft');
    expect(document.activeElement).toBe(right);
    key(right, 'Home');
    expect(document.activeElement).toBe(left);
  });

  it('vertical usa flechas arriba/abajo y aplica la clase; full width', () => {
    document.body.innerHTML = exclusiveMarkup('data-orientation="vertical" data-full-width');
    initAll();
    const groupEl = document.querySelector('.mtx-toggle-button-group');
    expect(groupEl.classList.contains('mtx-toggle-button-group--vertical')).toBe(true);
    expect(groupEl.classList.contains('mtx-toggle-button-group--full-width')).toBe(true);
    const [left, center] = groupEl.querySelectorAll('button');
    left.focus();
    key(left, 'ArrowRight');
    expect(document.activeElement).toBe(left);
    key(left, 'ArrowDown');
    expect(document.activeElement).toBe(center);
  });

  it('disable()/enable() del grupo y data-label', () => {
    document.body.innerHTML = `
      <div data-mtx="toggle-button-group" data-exclusive data-label="View" data-disabled>
        <button data-value="list" data-icon="view_list" aria-label="List"></button>
        <button data-value="grid" data-icon="grid_view" aria-label="Grid"></button>
      </div>`;
    initAll();
    const groupEl = document.querySelector('.mtx-toggle-button-group');
    const group = getInstance(groupEl);
    expect(groupEl.getAttribute('aria-label')).toBe('View');
    expect(group.disabled).toBe(true);
    expect(groupEl.getAttribute('aria-disabled')).toBe('true');
    group.enable();
    expect(group.disabled).toBe(false);
    expect(groupEl.querySelector('button').disabled).toBe(false);
  });

  it('es idempotente y el clic de un hijo no lo alterna por sí solo', () => {
    document.body.innerHTML = exclusiveMarkup();
    initAll();
    initAll();
    const groupEl = document.querySelector('.mtx-toggle-button-group');
    expect(groupEl.querySelectorAll('.material-icons').length).toBe(4);
    const center = groupEl.querySelectorAll('button')[1];
    const childHandler = vi.fn();
    center.addEventListener('mtx:toggle-button:change', childHandler);
    click(center);
    expect(childHandler).not.toHaveBeenCalled();
    expect(center.getAttribute('aria-pressed')).toBe('true');
  });

  it('uso programático con new ToggleButtonGroup()', () => {
    const groupEl = document.createElement('div');
    groupEl.setAttribute('data-exclusive', '');
    groupEl.innerHTML = '<button data-value="a">A</button><button data-value="b" aria-pressed="true">B</button>';
    document.body.appendChild(groupEl);
    const group = new ToggleButtonGroup(groupEl);
    expect(group.value).toBe('b');
    expect(group.buttons.length).toBe(2);
  });
});
