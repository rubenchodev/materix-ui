import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach } from 'vitest';
import { initAll, getInstance } from '../src/core/registry.js';
import { Pagination, getPaginationItems } from '../src/components/pagination/pagination.js';
import { resetLocale } from '../src/i18n/index.js';

/**
 * Monta una paginación e inicializa.
 * @param {string} attrs Atributos extra.
 * @param {string} [tag='nav'] Etiqueta.
 * @returns {{el: HTMLElement, instance: Pagination}} Elemento e instancia.
 */
function mount(attrs = '', tag = 'nav') {
  document.body.innerHTML = `<${tag} data-mtx="pagination" ${attrs}></${tag}>`;
  const el = document.body.firstElementChild;
  initAll();
  return { el, instance: getInstance(el) };
}

/** @returns {string[]} Textos de los ítems visibles. */
const labels = () => Array.from(document.querySelectorAll('.mtx-pagination__ul > li')).map((li) => {
  const item = li.firstElementChild;
  return item.classList.contains('mtx-pagination__item--nav') ? item.getAttribute('data-key') : item.textContent;
});

const base = { siblingCount: 1, boundaryCount: 1, showFirstButton: false, showLastButton: false, hidePrevButton: false, hideNextButton: false };

describe('getPaginationItems (algoritmo usePagination de MUI)', () => {
  it('sin elipsis para pocas páginas', () => {
    expect(getPaginationItems({ ...base, count: 5, page: 1 })).toEqual(['previous', 1, 2, 3, 4, 5, 'next']);
  });
  it('elipsis final, ambas e inicial', () => {
    expect(getPaginationItems({ ...base, count: 10, page: 1 })).toEqual(['previous', 1, 2, 3, 4, 5, 'end-ellipsis', 10, 'next']);
    expect(getPaginationItems({ ...base, count: 10, page: 5 })).toEqual(['previous', 1, 'start-ellipsis', 4, 5, 6, 'end-ellipsis', 10, 'next']);
    expect(getPaginationItems({ ...base, count: 10, page: 10 })).toEqual(['previous', 1, 'start-ellipsis', 6, 7, 8, 9, 10, 'next']);
  });
  it('sibling/boundary y botones primera/última', () => {
    expect(getPaginationItems({ ...base, count: 11, page: 6, siblingCount: 0, showFirstButton: true, showLastButton: true }))
      .toEqual(['first', 'previous', 1, 'start-ellipsis', 6, 'end-ellipsis', 11, 'next', 'last']);
    expect(getPaginationItems({ ...base, count: 11, page: 6, boundaryCount: 2, hidePrevButton: true, hideNextButton: true }))
      .toEqual([1, 2, 'start-ellipsis', 5, 6, 7, 'end-ellipsis', 10, 11]);
  });
});

describe('Pagination', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
    resetLocale();
  });

  it('se inicializa con clases, nav accesible y aria-current', () => {
    const { el, instance } = mount('data-count="10" data-page="5"');
    expect(instance).toBeInstanceOf(Pagination);
    expect(el.classList.contains('mtx-pagination')).toBe(true);
    expect(el.className).toMatch(/mtx-pagination--text/);
    expect(el.className).toMatch(/mtx-pagination--circular/);
    expect(el.className).toMatch(/mtx-pagination--medium/);
    expect(el.className).toMatch(/mtx-pagination--color-standard/);
    expect(el.getAttribute('aria-label')).toBe('pagination navigation');
    const current = el.querySelector('[aria-current="page"]');
    expect(current.textContent).toBe('5');
    expect(current.getAttribute('aria-label')).toBe('page 5');
    expect(el.querySelector('[data-key="page-6"]').getAttribute('aria-label')).toBe('Go to page 6');
    expect(el.querySelector('[data-key="next"]').getAttribute('aria-label')).toBe('Go to next page');
    expect(el.querySelectorAll('.mtx-pagination__ellipsis').length).toBe(2);
    expect(labels()).toEqual(['previous', '1', '…', '4', '5', '6', '…', '10', 'next']);
  });

  it('aplica variante, forma, tamaño y color', () => {
    const { el } = mount('data-count="3" data-variant="outlined" data-shape="rounded" data-size="large" data-color="primary"');
    ['outlined', 'rounded', 'large', 'color-primary'].forEach((m) => expect(el.classList.contains(`mtx-pagination--${m}`)).toBe(true));
  });

  it('ignora valores inválidos y usa los predeterminados', () => {
    const { el } = mount('data-count="3" data-variant="contained" data-size="xl"');
    expect(el.classList.contains('mtx-pagination--text')).toBe(true);
    expect(el.classList.contains('mtx-pagination--medium')).toBe(true);
  });

  it('deshabilita anterior/primera en la página 1 y siguiente/última en la última', () => {
    const { el, instance } = mount('data-count="4" data-show-first-button data-show-last-button');
    expect(el.querySelector('[data-key="first"]').disabled).toBe(true);
    expect(el.querySelector('[data-key="previous"]').disabled).toBe(true);
    expect(el.querySelector('[data-key="next"]').disabled).toBe(false);
    instance.page = 4;
    expect(el.querySelector('[data-key="last"]').disabled).toBe(true);
    expect(el.querySelector('[data-key="next"]').disabled).toBe(true);
  });

  it('oculta anterior y siguiente', () => {
    mount('data-count="3" data-hide-prev-button data-hide-next-button');
    expect(labels()).toEqual(['1', '2', '3']);
  });

  it('clic cambia de página, emite mtx:pagination:change y conserva el foco', () => {
    const { el, instance } = mount('data-count="10"');
    const events = [];
    el.addEventListener('mtx:pagination:change', (e) => events.push(e.detail));
    const next = el.querySelector('[data-key="next"]');
    next.focus();
    next.click();
    expect(instance.page).toBe(2);
    expect(events).toEqual([{ page: 2, previousPage: 1 }]);
    expect(document.activeElement.getAttribute('data-key')).toBe('next');
    el.querySelector('[data-key="page-10"]').click();
    expect(instance.page).toBe(10);
    expect(el.getAttribute('data-page')).toBe('10');
  });

  it('mueve el foco a la página actual si el botón enfocado se deshabilita', () => {
    const { el } = mount('data-count="2" data-page="1"');
    const next = el.querySelector('[data-key="next"]');
    next.focus();
    next.click();
    expect(document.activeElement.getAttribute('aria-current')).toBe('page');
  });

  it('API: page (silencioso), count, goTo, next, previous', () => {
    const { el, instance } = mount('data-count="5"');
    let fired = 0;
    el.addEventListener('mtx:pagination:change', () => { fired += 1; });
    instance.page = 3;
    expect(fired).toBe(0);
    expect(instance.goTo(3)).toBe(false);
    expect(instance.goTo(99)).toBe(true);
    expect(instance.page).toBe(5);
    expect(instance.previous()).toBe(true);
    expect(instance.next()).toBe(true);
    expect(fired).toBe(3);
    instance.count = 2;
    expect(instance.page).toBe(2);
    expect(labels()).toEqual(['previous', '1', '2', 'next']);
  });

  it('data-disabled y disable()/enable()', () => {
    const { el, instance } = mount('data-count="3" data-disabled');
    expect(instance.disabled).toBe(true);
    expect(Array.from(el.querySelectorAll('button')).every((b) => b.disabled)).toBe(true);
    instance.enable();
    expect(el.querySelector('[data-key="page-2"]').disabled).toBe(false);
  });

  it('count 0 no pinta páginas y deshabilita la navegación', () => {
    const { el } = mount('data-count="0"');
    expect(el.querySelectorAll('.mtx-pagination__item--page').length).toBe(0);
    expect(el.querySelector('[data-key="next"]').disabled).toBe(true);
  });

  it('modo enlaces: href desde la plantilla y aria-disabled en los no navegables', () => {
    const { el, instance } = mount('data-count="5" data-page="1" data-href-template="?page={page}"');
    expect(el.querySelector('[data-key="page-3"]').getAttribute('href')).toBe('?page=3');
    const prev = el.querySelector('[data-key="previous"]');
    expect(prev.tagName).toBe('A');
    expect(prev.hasAttribute('href')).toBe(false);
    expect(prev.getAttribute('aria-disabled')).toBe('true');
    el.addEventListener('mtx:pagination:change', (e) => e.preventDefault());
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    el.querySelector('[data-key="page-3"]').dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(instance.page).toBe(3);
  });

  it('acepta <ul> como elemento y lo envuelve en <nav>', () => {
    const { el, instance } = mount('data-count="3"', 'ul');
    expect(el.parentElement.tagName).toBe('NAV');
    expect(getInstance(el.parentElement)).toBe(instance);
    expect(el.classList.contains('mtx-pagination__ul')).toBe(true);
  });

  it('añade role="navigation" en un <div> y es idempotente', () => {
    const { el, instance } = mount('data-count="3"', 'div');
    expect(el.getAttribute('role')).toBe('navigation');
    initAll();
    expect(getInstance(el)).toBe(instance);
    expect(el.querySelectorAll('ul').length).toBe(1);
  });

  it('traduce las etiquetas al español', () => {
    document.documentElement.setAttribute('lang', 'es');
    const { el } = mount('data-count="3"');
    expect(el.getAttribute('aria-label')).toBe('navegación de paginación');
    expect(el.querySelector('[data-key="page-2"]').getAttribute('aria-label')).toBe('Ir a la página 2');
    expect(el.querySelector('[data-key="next"]').getAttribute('aria-label')).toBe('Ir a la página siguiente');
  });

  it('CSS: tamaños canónicos MUI, tema oscuro y reduced motion', () => {
    const css = readFileSync('src/components/pagination/pagination.css', 'utf8');
    expect(css).toMatch(/--mtx-pagination-size:\s*32px/);
    expect(css).toMatch(/--mtx-pagination-size:\s*26px/);
    expect(css).toMatch(/--mtx-pagination-size:\s*40px/);
    expect(css).toMatch(/prefers-reduced-motion/);
    expect(css).toMatch(/\[data-mtx-theme='dark'\]/);
  });
  it('mtx:pagination:change mantiene detail, burbujeo y cancelabilidad según el modo', () => {
    const { el, instance } = mount('data-count="5" data-page="1"');
    const events = [];
    document.body.addEventListener('mtx:pagination:change', (e) => events.push(e));
    instance.goTo(2);
    expect(events[0].detail).toEqual({ page: 2, previousPage: 1 });
    expect(events[0].bubbles).toBe(true);
    expect(events[0].cancelable).toBe(false);

    const links = mount('data-count="5" data-page="1" data-href-template="?page={page}"');
    links.el.addEventListener('mtx:pagination:change', (e) => e.preventDefault());
    links.el.querySelector('[data-key="page-3"]').click();
    const linkEvent = events[events.length - 1];
    expect(linkEvent.cancelable).toBe(true);
    expect(linkEvent.detail).toEqual({ page: 3, previousPage: 1, href: '?page=3' });
    expect(links.instance.page).toBe(3);
    expect(el.isConnected).toBe(false);
  });
});
