import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, registerInstance } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { emit } from '../../core/events.js';

/** Iconos SVG de MUI (FirstPage, NavigateBefore, NavigateNext, LastPage). */
const ICONS = {
  first: 'M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z',
  previous: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  next: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  last: 'M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z',
};

const VARIANTS = ['text', 'outlined'];
const SHAPES = ['circular', 'rounded'];
const SIZES = ['small', 'medium', 'large'];
const COLORS = ['standard', 'primary', 'secondary'];
const NAV_TYPES = ['first', 'previous', 'next', 'last'];

/**
 * Genera un rango inclusivo de enteros.
 *
 * @param {number} start Inicio.
 * @param {number} end Fin.
 * @returns {number[]} Rango.
 */
function range(start, end) {
  const length = end - start + 1;
  return length > 0 ? Array.from({ length }, (_, i) => start + i) : [];
}

/**
 * Calcula la lista de ítems visibles (algoritmo `usePagination` de MUI).
 *
 * @param {{count: number, page: number, siblingCount: number, boundaryCount: number,
 *   showFirstButton: boolean, showLastButton: boolean, hidePrevButton: boolean, hideNextButton: boolean}} options Opciones.
 * @returns {Array<number|string>} Números de página y tipos (`first`, `previous`, `start-ellipsis`…).
 */
export function getPaginationItems(options) {
  const { count, page, siblingCount, boundaryCount } = options;
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);
  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  );

  let startGap = [];
  if (siblingsStart > boundaryCount + 2) startGap = ['start-ellipsis'];
  else if (boundaryCount + 1 < count - boundaryCount) startGap = [boundaryCount + 1];

  let endGap = [];
  if (siblingsEnd < count - boundaryCount - 1) endGap = ['end-ellipsis'];
  else if (count - boundaryCount > boundaryCount) endGap = [count - boundaryCount];

  return [
    ...(options.showFirstButton ? ['first'] : []),
    ...(options.hidePrevButton ? [] : ['previous']),
    ...startPages,
    ...startGap,
    ...range(siblingsStart, siblingsEnd),
    ...endGap,
    ...endPages,
    ...(options.hideNextButton ? [] : ['next']),
    ...(options.showLastButton ? ['last'] : []),
  ];
}

/**
 * Representa una paginación (Pagination) de Materix UI.
 *
 * Sigue `Pagination` de MUI: botones de página con elipsis, anterior/siguiente
 * y primera/última opcionales, variantes text/outlined, formas circular/rounded,
 * tamaños y colores. Puede renderizar enlaces (`data-href-template`) para SSR.
 *
 * Uso declarativo:
 * ```html
 * <nav data-mtx="pagination" data-count="10" data-page="1"></nav>
 * ```
 */
export class Pagination extends ComponentBase {
  /**
   * Crea la paginación y pinta sus ítems.
   *
   * @param {HTMLElement} element `<nav>` (recomendado), `<div>` o `<ul>`.
   */
  constructor(element) {
    super(element);
    this.source = element;
    const read = (name, fallback, min) => {
      const value = Number.parseInt(element.getAttribute(name), 10);
      return Number.isFinite(value) ? Math.max(min, value) : fallback;
    };
    const flag = (name) => element.hasAttribute(name) && element.getAttribute(name) !== 'false';

    this._count = read('data-count', 1, 0);
    this._page = read('data-page', 1, 1);
    this._siblingCount = read('data-sibling-count', 1, 0);
    this._boundaryCount = read('data-boundary-count', 1, 0);
    this._options = {
      showFirstButton: flag('data-show-first-button'),
      showLastButton: flag('data-show-last-button'),
      hidePrevButton: flag('data-hide-prev-button'),
      hideNextButton: flag('data-hide-next-button'),
    };
    this._hrefTemplate = element.getAttribute('data-href-template');
    this._disabled = flag('data-disabled');

    this._buildStructure();

    this._handleClick = (event) => this._onClick(event);
    this._handlePointerDown = (event) => {
      const item = event.target.closest('.mtx-pagination__item');
      if (!item || event.button !== 0 || this._isItemDisabled(item)) return;
      createRipple(item, event);
    };
    this._handleLocaleChange = () => {
      if (this._autoLabel) this.element.setAttribute('aria-label', this._t('label', 'pagination navigation'));
      this._render();
    };
    this.list.addEventListener('click', this._handleClick);
    this.list.addEventListener('pointerdown', this._handlePointerDown);
    this.listen(document, 'mtx:locale:change', this._handleLocaleChange);

    this._page = this._clamp(this._page);
    this._render();
  }

  /** @returns {number} Página actual (base 1). */
  get page() {
    return this._page;
  }

  /** @param {number} value Página nueva; se ajusta a `[1, count]` sin emitir evento. */
  set page(value) {
    this._page = this._clamp(value);
    this._render();
  }

  /** @returns {number} Número total de páginas. */
  get count() {
    return this._count;
  }

  /** @param {number} value Total de páginas; la página actual se ajusta si queda fuera. */
  set count(value) {
    this._count = Math.max(0, Number.parseInt(value, 10) || 0);
    this._page = this._clamp(this._page);
    this._render();
  }

  /** @returns {boolean} `true` si la paginación está deshabilitada. */
  get disabled() {
    return this._disabled;
  }

  /** Deshabilita todos los ítems. */
  disable() {
    this._disabled = true;
    this._render();
  }

  /** Habilita los ítems. */
  enable() {
    this._disabled = false;
    this._render();
  }

  /**
   * Va a una página y emite `mtx:pagination:change` si cambia.
   *
   * @param {number} page Página destino (base 1).
   * @returns {boolean} `true` si la página cambió.
   */
  goTo(page) {
    const next = this._clamp(page);
    if (next === this._page || this._count === 0) return false;
    const previousPage = this._page;
    this._page = next;
    this._render();
    emit(this.element, 'mtx:pagination:change', { page: next, previousPage });
    return true;
  }

  /** Va a la página siguiente. @returns {boolean} `true` si cambió. */
  next() {
    return this.goTo(this._page + 1);
  }

  /** Va a la página anterior. @returns {boolean} `true` si cambió. */
  previous() {
    return this.goTo(this._page - 1);
  }

  /** Elimina listeners instalados. */
  destroy() {
    this.list.removeEventListener('click', this._handleClick);
    this.list.removeEventListener('pointerdown', this._handlePointerDown);
    super.destroy();
  }

  /** Crea `<nav>` + `<ul>` y aplica las clases de variante. */
  _buildStructure() {
    const source = this.source;
    let nav = source;
    let list;
    if (source.tagName === 'UL' || source.tagName === 'OL') {
      nav = document.createElement('nav');
      source.parentNode.insertBefore(nav, source);
      nav.appendChild(source);
      list = source;
      ['aria-label', 'aria-labelledby'].forEach((attr) => {
        if (source.hasAttribute(attr)) {
          nav.setAttribute(attr, source.getAttribute(attr));
          source.removeAttribute(attr);
        }
      });
      Array.from(source.classList).forEach((cls) => {
        if (cls.startsWith('mtx-pagination--')) {
          source.classList.remove(cls);
          nav.className += ` ${cls}`;
        }
      });
      source.classList.remove('mtx-pagination');
    } else {
      list = source.querySelector(':scope > ul.mtx-pagination__ul, :scope > ul');
      if (!list) {
        list = document.createElement('ul');
        source.appendChild(list);
      }
      if (source.tagName !== 'NAV' && !source.hasAttribute('role')) source.setAttribute('role', 'navigation');
    }

    const pick = (name, allowed, fallback) => {
      const value = source.getAttribute(name);
      return allowed.includes(value) ? value : fallback;
    };
    this._variant = pick('data-variant', VARIANTS, 'text');
    this._shape = pick('data-shape', SHAPES, 'circular');
    this._size = pick('data-size', SIZES, 'medium');
    this._color = pick('data-color', COLORS, 'standard');

    nav.classList.add('mtx-pagination', `mtx-pagination--${this._variant}`, `mtx-pagination--${this._shape}`,
      `mtx-pagination--${this._size}`, `mtx-pagination--color-${this._color}`);
    list.classList.add('mtx-pagination__ul');

    this.element = nav;
    this.list = list;
    if (nav !== source) registerInstance(nav, this);
    this._autoLabel = !nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby');
    if (this._autoLabel) nav.setAttribute('aria-label', this._t('label', 'pagination navigation'));
  }

  /**
   * Traduce una clave del diccionario `pagination`.
   *
   * @param {string} key Clave.
   * @param {string} fallback Texto por defecto.
   * @param {Object} [params] Parámetros de interpolación.
   * @returns {string} Texto traducido.
   */
  _t(key, fallback, params = null) {
    return t('pagination', key, params, fallback, getComponentLocale(this.element || this.source));
  }

  /**
   * Ajusta un valor al rango válido de páginas.
   *
   * @param {number} value Página propuesta.
   * @returns {number} Página válida.
   */
  _clamp(value) {
    const page = Number.parseInt(value, 10);
    const max = Math.max(1, this._count);
    return Math.min(Math.max(1, Number.isFinite(page) ? page : 1), max);
  }

  /**
   * Página destino de un tipo de botón de navegación.
   *
   * @param {string} type `first`, `previous`, `next` o `last`.
   * @returns {number} Página destino.
   */
  _targetOf(type) {
    if (type === 'first') return 1;
    if (type === 'previous') return this._page - 1;
    if (type === 'next') return this._page + 1;
    return this._count;
  }

  /**
   * @param {HTMLElement} item Ítem.
   * @returns {boolean} `true` si el ítem no admite interacción.
   */
  _isItemDisabled(item) {
    return item.disabled === true || item.getAttribute('aria-disabled') === 'true';
  }

  /**
   * Crea un ítem interactivo (botón o enlace).
   *
   * @param {number} page Página destino.
   * @param {string} key Clave de foco (`page-3`, `next`…).
   * @param {boolean} disabled Si está deshabilitado.
   * @returns {HTMLElement} Elemento creado.
   */
  _createControl(page, key, disabled) {
    let control;
    if (this._hrefTemplate) {
      control = document.createElement('a');
      if (disabled) {
        control.setAttribute('aria-disabled', 'true');
        control.setAttribute('role', 'link');
      } else {
        control.href = this._hrefTemplate.replace(/\{page\}/g, String(page));
      }
    } else {
      control = document.createElement('button');
      control.type = 'button';
      control.disabled = disabled;
    }
    control.className = 'mtx-pagination__item';
    control.setAttribute('data-page', String(page));
    control.setAttribute('data-key', key);
    return control;
  }

  /** Pinta la lista completa conservando el foco. */
  _render() {
    const active = document.activeElement;
    const focusedKey = active && this.list.contains(active) ? active.getAttribute('data-key') : null;

    const entries = this._count > 0
      ? getPaginationItems({
        count: this._count,
        page: this._page,
        siblingCount: this._siblingCount,
        boundaryCount: this._boundaryCount,
        ...this._options,
      })
      : this._options.hidePrevButton && this._options.hideNextButton ? [] : NAV_TYPES.filter((type) => (
        (type === 'first' && this._options.showFirstButton) || (type === 'last' && this._options.showLastButton)
        || (type === 'previous' && !this._options.hidePrevButton) || (type === 'next' && !this._options.hideNextButton)
      ));

    const nodes = entries.map((entry) => {
      const li = document.createElement('li');
      if (typeof entry === 'number') {
        const selected = entry === this._page;
        const control = this._createControl(entry, `page-${entry}`, this._disabled);
        control.classList.add('mtx-pagination__item--page');
        control.textContent = String(entry);
        control.setAttribute('aria-label', selected
          ? this._t('page', 'page {page}', { page: entry })
          : this._t('goToPage', 'Go to page {page}', { page: entry }));
        if (selected) {
          control.setAttribute('aria-current', 'page');
          control.classList.add('mtx-pagination__item--selected');
        }
        li.appendChild(control);
      } else if (entry === 'start-ellipsis' || entry === 'end-ellipsis') {
        const ellipsis = document.createElement('div');
        ellipsis.className = 'mtx-pagination__ellipsis';
        ellipsis.textContent = '…';
        if (this._disabled) ellipsis.classList.add('mtx-pagination__ellipsis--disabled');
        li.appendChild(ellipsis);
      } else {
        const target = this._targetOf(entry);
        const disabled = this._disabled || this._count === 0
          || (entry === 'first' || entry === 'previous' ? this._page <= 1 : this._page >= this._count);
        const control = this._createControl(target, entry, disabled);
        control.classList.add('mtx-pagination__item--nav', `mtx-pagination__item--${entry}`);
        control.setAttribute('aria-label', this._t(entry, `Go to ${entry} page`));
        control.innerHTML = `<svg class="mtx-pagination__icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="${ICONS[entry]}"/></svg>`;
        li.appendChild(control);
      }
      return li;
    });

    this.list.replaceChildren(...nodes);
    this.element.classList.toggle('mtx-pagination--disabled', this._disabled);
    this.source.setAttribute('data-page', String(this._page));
    this.source.setAttribute('data-count', String(this._count));

    if (focusedKey) {
      let target = this.list.querySelector(`[data-key="${focusedKey}"]`);
      if (!target || this._isItemDisabled(target)) target = this.list.querySelector('[aria-current="page"]');
      if (target) target.focus();
    }
  }

  /**
   * Gestiona la activación de un ítem.
   *
   * @param {MouseEvent} event Clic original.
   */
  _onClick(event) {
    const item = event.target.closest('.mtx-pagination__item');
    if (!item || !this.list.contains(item)) return;
    if (this._isItemDisabled(item)) {
      event.preventDefault();
      return;
    }
    const page = Number.parseInt(item.getAttribute('data-page'), 10);
    if (!this._hrefTemplate) {
      this.goTo(page);
      return;
    }
    // Modo enlaces: la navegación es nativa salvo que se cancele el evento.
    if (page === this._page) return;
    const allowed = emit(this.element, 'mtx:pagination:change', {
      page,
      previousPage: this._page,
      href: item.getAttribute('href'),
    }, { cancelable: true });
    if (!allowed) {
      event.preventDefault();
      this._page = this._clamp(page);
      this._render();
    }
  }
}

registerComponent('pagination', Pagination);
