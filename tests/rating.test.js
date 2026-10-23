import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Rating } from '../src/components/rating/rating.js';

const pointerClick = (input) => {
  input.closest('.mtx-rating').dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
  input.click();
};

describe('Rating', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
  });

  it('auto-construye 5 estrellas con radios ocultos, etiquetas y radio vacío', () => {
    document.body.innerHTML = '<span data-mtx="rating" data-value="3" data-name="score"></span>';
    initAll();
    const el = document.querySelector('.mtx-rating');
    const rating = getInstance(el);
    expect(rating).toBeInstanceOf(Rating);
    expect(el.querySelectorAll('.mtx-rating__item').length).toBe(5);
    const inputs = el.querySelectorAll('input[type="radio"]');
    expect(inputs.length).toBe(6);
    inputs.forEach((input) => expect(input.name).toBe('score'));
    expect(el.querySelector('input[value="3"]').checked).toBe(true);
    expect(el.querySelector('label[for="score-1"]').textContent).toBe('1 Star');
    expect(el.querySelector('label[for="score-3"]').textContent).toBe('3 Stars');
    expect(el.querySelector('label[for="score-empty"]').textContent).toBe('Empty');
    expect(el.querySelectorAll('.mtx-rating__label--filled').length).toBe(3);
    expect(el.querySelector('svg')).not.toBeNull();
    expect(rating.value).toBe(3);
  });

  it('cambia con el radio nativo y emite mtx:rating:change', () => {
    document.body.innerHTML = '<span data-mtx="rating" data-value="2"></span>';
    initAll();
    const el = document.querySelector('.mtx-rating');
    const handler = vi.fn();
    el.addEventListener('mtx:rating:change', handler);
    const four = el.querySelector('input[value="4"]');
    four.checked = true;
    four.dispatchEvent(new Event('change', { bubbles: true }));
    expect(getInstance(el).value).toBe(4);
    expect(handler.mock.calls[0][0].detail).toEqual({ value: 4 });
    expect(el.querySelectorAll('.mtx-rating__label--filled').length).toBe(4);
  });

  it('un clic de puntero sobre el valor actual lo borra (null)', () => {
    document.body.innerHTML = '<span data-mtx="rating" data-value="3"></span>';
    initAll();
    const el = document.querySelector('.mtx-rating');
    const handler = vi.fn();
    el.addEventListener('mtx:rating:change', handler);
    pointerClick(el.querySelector('input[value="3"]'));
    expect(getInstance(el).value).toBe(null);
    expect(handler.mock.calls[0][0].detail.value).toBe(null);
    expect(el.querySelector('.mtx-rating__input--empty').checked).toBe(true);
  });

  it('precisión 0.5: dos radios por estrella y etiquetas parciales', () => {
    document.body.innerHTML = '<span data-mtx="rating" data-value="2.4" data-precision="0.5" data-name="half"></span>';
    initAll();
    const el = document.querySelector('.mtx-rating');
    expect(el.querySelectorAll('input[type="radio"]').length).toBe(11);
    expect(el.querySelectorAll('.mtx-rating__label--partial').length).toBe(5);
    expect(getInstance(el).value).toBe(2.5);
    expect(el.querySelector('input[value="2.5"]').checked).toBe(true);
    expect(el.querySelector('label[for="half-2_5"]').textContent).toBe('2.5 Stars');
  });

  it('read-only: role="img", aria-label y sin radios', () => {
    document.body.innerHTML = '<span data-mtx="rating" data-value="4" data-read-only></span>';
    initAll();
    const el = document.querySelector('.mtx-rating');
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Rated 4 out of 5');
    expect(el.querySelectorAll('input').length).toBe(0);
    getInstance(el).value = 2;
    expect(el.getAttribute('aria-label')).toBe('Rated 2 out of 5');
  });

  it('traduce etiquetas según lang', () => {
    document.body.innerHTML = '<div lang="es"><span data-mtx="rating" data-value="1" data-name="es"></span>'
      + '<span data-mtx="rating" data-value="3.5" data-precision="0.5" data-read-only></span></div>';
    initAll();
    expect(document.querySelector('label[for="es-1"]').textContent).toBe('1 estrella');
    expect(document.querySelector('label[for="es-empty"]').textContent).toBe('Sin valoración');
    expect(document.querySelector('[role="img"]').getAttribute('aria-label')).toBe('Valoración: 3,5 de 5');
  });

  it('data-max, data-size, iconos personalizados y highlight-selected-only', () => {
    document.body.innerHTML = '<span data-mtx="rating" data-max="10" data-value="6" data-size="large" data-icon="favorite" data-empty-icon="favorite_border" data-highlight-selected-only></span>'
      + '<span data-mtx="rating" data-icon="sentiment_satisfied" data-size="small"></span>';
    initAll();
    const [hearts, faces] = document.querySelectorAll('.mtx-rating');
    expect(hearts.classList.contains('mtx-rating--large')).toBe(true);
    expect(hearts.querySelectorAll('.mtx-rating__item').length).toBe(10);
    expect(hearts.querySelectorAll('.mtx-rating__label--filled').length).toBe(1);
    expect(faces.classList.contains('mtx-rating--small')).toBe(true);
    expect(faces.querySelector('.material-icons').textContent).toBe('sentiment_satisfied');
  });

  it('data-disabled, disable()/enable() y role radiogroup con aria-label', () => {
    document.body.innerHTML = '<span data-mtx="rating" data-value="2" data-disabled data-label="Quality"></span>';
    initAll();
    const el = document.querySelector('.mtx-rating');
    const rating = getInstance(el);
    expect(el.getAttribute('role')).toBe('radiogroup');
    expect(el.getAttribute('aria-label')).toBe('Quality');
    expect(rating.disabled).toBe(true);
    el.querySelectorAll('input').forEach((input) => expect(input.disabled).toBe(true));
    rating.enable();
    expect(rating.disabled).toBe(false);
    expect(el.querySelector('input').disabled).toBe(false);
  });

  it('setter: redondea, acota y no emite eventos; 0 vacía', () => {
    document.body.innerHTML = '<span data-mtx="rating"></span>';
    initAll();
    const el = document.querySelector('.mtx-rating');
    const rating = getInstance(el);
    const handler = vi.fn();
    el.addEventListener('mtx:rating:change', handler);
    expect(rating.value).toBe(null);
    rating.value = 9;
    expect(rating.value).toBe(5);
    rating.value = 2.4;
    expect(rating.value).toBe(2);
    rating.value = 0;
    expect(rating.value).toBe(null);
    expect(handler).not.toHaveBeenCalled();
  });

  it('es idempotente y se vincula a estructura BEM existente', () => {
    document.body.innerHTML = '<span data-mtx="rating" data-value="2" data-name="idem"></span>';
    initAll();
    initAll();
    const el = document.querySelector('.mtx-rating');
    expect(el.querySelectorAll('.mtx-rating__item').length).toBe(5);
    const html = el.innerHTML;
    const copy = document.createElement('span');
    copy.className = 'mtx-rating';
    copy.innerHTML = html.replace(/idem/g, 'bem');
    document.body.appendChild(copy);
    copy.querySelector('input[value="2"]').checked = true;
    const bound = new Rating(copy);
    expect(copy.querySelectorAll('.mtx-rating__item').length).toBe(5);
    expect(bound.value).toBe(2);
  });
  it('emite mtx:rating:active y mtx:rating:change con detail { value } y burbujeo', () => {
    document.body.innerHTML = '<span data-mtx="rating" data-value="1"></span>';
    initAll();
    const el = document.querySelector('.mtx-rating');
    const rating = getInstance(el);
    const events = [];
    document.body.addEventListener('mtx:rating:active', (e) => events.push(e));
    document.body.addEventListener('mtx:rating:change', (e) => events.push(e));
    rating._setHover(4);
    pointerClick(el.querySelector('input[value="3"]'));
    const active = events.find((e) => e.type === 'mtx:rating:active');
    const change = events.find((e) => e.type === 'mtx:rating:change');
    expect(active.detail).toEqual({ value: 4 });
    expect(active.bubbles).toBe(true);
    expect(change.detail).toEqual({ value: 3 });
    expect(change.bubbles).toBe(true);
    expect(change.cancelable).toBe(false);
  });

  it('destroy() cancela el temporizador del clic de puntero', () => {
    vi.useFakeTimers();
    try {
      document.body.innerHTML = '<span data-mtx="rating" data-value="2"></span>';
      initAll();
      const el = document.querySelector('.mtx-rating');
      el.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      expect(vi.getTimerCount()).toBe(1);
      getInstance(el).destroy();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
