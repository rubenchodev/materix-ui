import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import '../src/components/chip/chip.js';

function createChip(attrs = '') {
  const chip = document.createElement('div');
  chip.className = 'mtx-chip';
  chip.setAttribute('data-mtx', 'chip');
  chip.setAttribute('data-label', 'JavaScript');
  attrs.split(' ').filter(Boolean).forEach((a) => {
    const eq = a.indexOf('=');
    if (eq === -1) chip.setAttribute(a, '');
    else chip.setAttribute(a.slice(0, eq), a.slice(eq + 1));
  });
  document.body.appendChild(chip);
  return chip;
}

describe('Chip', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('se inicializa y muestra el label', () => {
    const el = createChip();
    initAll();
    expect(getInstance(el)).toBeDefined();
    expect(el.querySelector('.mtx-chip__label').textContent).toBe('JavaScript');
  });

  it('sin data-deletable no crea botón de eliminar', () => {
    const el = createChip();
    initAll();
    expect(el.querySelector('.mtx-chip__delete')).toBeNull();
  });

  it('con data-deletable crea botón de eliminar', () => {
    const el = createChip('data-deletable');
    initAll();
    expect(el.querySelector('.mtx-chip__delete')).not.toBeNull();
  });

  it('al hacer clic en eliminar dispara el evento mtx:chip:delete', () => {
    const el = createChip('data-deletable');
    initAll();
    const handler = vi.fn();
    el.addEventListener('mtx:chip:delete', handler);
    el.querySelector('.mtx-chip__delete').click();
    expect(handler).toHaveBeenCalled();
  });

  it('el icono de eliminar no es enfocable ni un control anidado (axe nested-interactive)', () => {
    const el = createChip('data-deletable');
    initAll();
    const del = el.querySelector('.mtx-chip__delete');
    expect(del.tagName).toBe('SPAN');
    expect(del.getAttribute('aria-hidden')).toBe('true');
    expect(del.hasAttribute('tabindex')).toBe(false);
    expect(el.getAttribute('role')).toBe('button');
    expect(el.tabIndex).toBe(0);
    expect(el.querySelector('button, a[href], input, [tabindex]')).toBeNull();
  });

  it('Delete y Backspace sobre el chip emiten mtx:chip:delete', () => {
    const el = createChip('data-deletable');
    initAll();
    const handler = vi.fn();
    el.addEventListener('mtx:chip:delete', handler);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('un botón de eliminar pre-renderizado se convierte en icono no enfocable', () => {
    document.body.innerHTML = '<div class="mtx-chip" data-mtx="chip" data-deletable><span class="mtx-chip__label">A</span>'
      + '<button type="button" class="mtx-chip__delete" tabindex="-1" aria-label="Quitar">x</button></div>';
    initAll();
    const del = document.querySelector('.mtx-chip__delete');
    expect(del.tagName).toBe('SPAN');
    expect(del.textContent).toBe('x');
  });

  it('sin data-clickable ni data-deletable no tiene role=button ni tabindex', () => {
    const el = createChip();
    initAll();
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('con data-clickable añade la clase interactiva', () => {
    const el = createChip('data-clickable');
    initAll();
    expect(el.classList.contains('mtx-chip--clickable')).toBe(true);
  });

  it('aplica data-variant, data-size y data-color', () => {
    const el = createChip('data-variant=outlined data-size=small data-color=primary');
    initAll();
    expect(el.classList.contains('mtx-chip--outlined')).toBe(true);
    expect(el.classList.contains('mtx-chip--small')).toBe(true);
    expect(el.classList.contains('mtx-chip--primary')).toBe(true);
  });
});