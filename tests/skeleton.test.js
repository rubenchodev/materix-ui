import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance, destroy } from '../src/core/registry.js';
import { Skeleton, skeleton } from '../src/components/skeleton/skeleton.js';

function mount(html) {
  document.body.innerHTML = html;
  initAll();
  return document.body.firstElementChild;
}

describe('Skeleton', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('crea un bloque text con pulse por defecto y aria-hidden', () => {
    const el = mount('<span data-mtx="skeleton"></span>');
    expect(getInstance(el)).toBeInstanceOf(Skeleton);
    expect(el.classList.contains('mtx-skeleton')).toBe(true);
    expect(el.classList.contains('mtx-skeleton--text')).toBe(true);
    expect(el.classList.contains('mtx-skeleton--pulse')).toBe(true);
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('aplica variantes y dimensiones (número = px)', () => {
    const el = mount('<span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="3rem"></span>');
    expect(el.classList.contains('mtx-skeleton--circular')).toBe(true);
    expect(el.style.width).toBe('40px');
    expect(el.style.height).toBe('3rem');
    ['rectangular', 'rounded'].forEach((variant) => {
      const block = mount(`<span data-mtx="skeleton" data-variant="${variant}" data-width="60%"></span>`);
      expect(block.classList.contains(`mtx-skeleton--${variant}`)).toBe(true);
      expect(block.style.width).toBe('60%');
    });
  });

  it('variante desconocida vuelve a text', () => {
    const el = mount('<span data-mtx="skeleton" data-variant="pill"></span>');
    expect(el.classList.contains('mtx-skeleton--text')).toBe(true);
  });

  it('soporta animaciones wave y false', () => {
    const wave = mount('<span data-mtx="skeleton" data-animation="wave"></span>');
    expect(wave.classList.contains('mtx-skeleton--wave')).toBe(true);
    expect(wave.classList.contains('mtx-skeleton--pulse')).toBe(false);
    const none = mount('<span data-mtx="skeleton" data-animation="false"></span>');
    expect(none.classList.contains('mtx-skeleton--no-animation')).toBe(true);
    getInstance(none).setAnimation('wave');
    expect(none.classList.contains('mtx-skeleton--wave')).toBe(true);
    expect(none.classList.contains('mtx-skeleton--no-animation')).toBe(false);
  });

  it('con hijos marca with-children para tomar su forma', () => {
    const el = mount('<div data-mtx="skeleton" data-variant="circular"><img alt="" width="40" height="40"></div>');
    expect(el.classList.contains('mtx-skeleton--with-children')).toBe(true);
  });

  it('con texto directo también toma su forma', () => {
    const el = mount('<div data-mtx="skeleton">Título</div>');
    expect(el.classList.contains('mtx-skeleton--with-children')).toBe(true);
    // El texto directo queda envuelto para ocultarse con visibility (no texto transparente).
    const wrapper = el.querySelector(':scope > .mtx-skeleton__text');
    expect(wrapper?.textContent).toBe('Título');
    initAll();
    expect(el.querySelectorAll('.mtx-skeleton__text')).toHaveLength(1);
    const empty = mount('<span data-mtx="skeleton">  </span>');
    expect(empty.classList.contains('mtx-skeleton--with-children')).toBe(false);
  });

  it('data-lines genera N líneas text y la última más corta', () => {
    const el = mount('<div data-mtx="skeleton" data-lines="3" data-animation="wave"></div>');
    expect(el.classList.contains('mtx-skeleton-lines')).toBe(true);
    expect(el.classList.contains('mtx-skeleton')).toBe(false);
    const lines = el.querySelectorAll(':scope > .mtx-skeleton.mtx-skeleton--text');
    expect(lines.length).toBe(3);
    expect(lines[2].style.width).toBe('60%');
    expect(lines[0].classList.contains('mtx-skeleton--wave')).toBe(true);
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('data-last-width personaliza la última línea y no duplica al reinicializar', () => {
    const el = mount('<div data-mtx="skeleton" data-lines="2" data-last-width="40"></div>');
    expect(el.lastElementChild.style.width).toBe('40px');
    destroy(el);
    initAll();
    expect(el.querySelectorAll('.mtx-skeleton').length).toBe(2);
  });

  it('respeta la sintaxis BEM (SSR)', () => {
    const el = mount('<span class="mtx-skeleton mtx-skeleton--rounded mtx-skeleton--wave" data-mtx="skeleton"></span>');
    expect(getInstance(el).variant).toBe('rounded');
    expect(getInstance(el).animation).toBe('wave');
  });

  it('es idempotente', () => {
    const el = mount('<span data-mtx="skeleton"></span>');
    const instance = getInstance(el);
    initAll();
    expect(getInstance(el)).toBe(instance);
  });
});

describe('skeleton.set (región de carga)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('alterna data-loading y aria-busy y emite mtx:skeleton:change', () => {
    const region = mount(`<section id="r" aria-live="polite">
      <div data-skeleton-placeholder><span data-mtx="skeleton"></span></div>
      <div data-skeleton-content>Contenido</div></section>`);
    const handler = vi.fn();
    region.addEventListener('mtx:skeleton:change', handler);

    expect(skeleton.set(region, true)).toBe(region);
    expect(region.hasAttribute('data-loading')).toBe(true);
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.querySelector('[data-skeleton-placeholder]').getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.isLoading('#r')).toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual({ loading: true });

    skeleton.set('#r', true);
    expect(handler).toHaveBeenCalledTimes(1);

    skeleton.set('#r', false);
    expect(region.hasAttribute('data-loading')).toBe(false);
    expect(region.hasAttribute('aria-busy')).toBe(false);
    expect(handler.mock.calls[1][0].detail).toEqual({ loading: false });

    expect(skeleton.toggle(region)).toBe(true);
    expect(skeleton.isLoading(region)).toBe(true);
  });

  it('devuelve null si el contenedor no existe', () => {
    expect(skeleton.set('#nope', true)).toBeNull();
    expect(skeleton.isLoading('#nope')).toBe(false);
  });

  it('data-loading="false" no cuenta como carga', () => {
    const region = mount('<div data-loading="false"></div>');
    expect(skeleton.isLoading(region)).toBe(false);
  });
});
