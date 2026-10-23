import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { emit } from '../../core/events.js';

const VARIANTS = ['text', 'circular', 'rectangular', 'rounded'];
const ANIMATIONS = ['pulse', 'wave', 'false'];
const LOADING_TRUE = (value) => value !== null && value !== 'false';

/**
 * Convierte un valor de dimensión: un número se interpreta en px.
 * @param {string|number|null} value Valor crudo (`120`, `60%`, `10rem`).
 * @returns {string} Valor CSS o cadena vacía.
 */
function toCssSize(value) {
  if (value === null || value === undefined) return '';
  const raw = String(value).trim();
  if (!raw) return '';
  return /^-?\d+(\.\d+)?$/.test(raw) ? `${raw}px` : raw;
}

/**
 * Placeholder de carga con la forma del contenido (Skeleton de MUI).
 *
 * Uso declarativo:
 * ```html
 * <span data-mtx="skeleton" data-variant="circular" data-width="40" data-height="40"></span>
 * <div data-mtx="skeleton" data-lines="3"></div>
 * ```
 *
 * Con hijos toma su tamaño (los oculta con `visibility: hidden`). Los bloques son
 * decorativos (`aria-hidden="true"`): el estado de carga se anuncia en el
 * contenedor con `aria-busy` (ver `skeleton.set()`).
 */
export class Skeleton extends ComponentBase {
  /**
   * Crea la instancia y aplica variante, tamaño, animación y líneas.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);
    element.setAttribute('aria-hidden', 'true');

    const lines = parseInt(element.getAttribute('data-lines'), 10);
    this._lines = Number.isFinite(lines) && lines > 1 ? lines : 0;
    this._variant = 'text';
    this._animation = 'pulse';

    if (this._lines) {
      this._renderLines();
    } else {
      element.classList.add('mtx-skeleton');
      this._wrapTextNodes();
      this.setVariant(element.getAttribute('data-variant') || this._variantFromClass() || 'text');
    }
    this._applySize(element);
    this.setAnimation(element.getAttribute('data-animation') || this._animationFromClass() || 'pulse');
  }

  /** @returns {string|null} Variante declarada por clase BEM (SSR), si existe. */
  _variantFromClass() {
    return VARIANTS.find((v) => this.element.classList.contains(`mtx-skeleton--${v}`)) || null;
  }

  /** @returns {string|null} Animación declarada por clase BEM (SSR), si existe. */
  _animationFromClass() {
    const { classList } = this.element;
    if (classList.contains('mtx-skeleton--wave')) return 'wave';
    if (classList.contains('mtx-skeleton--no-animation')) return 'false';
    return null;
  }

  /** Aplica `data-width`/`data-height` al elemento raíz. */
  _applySize(target) {
    const width = toCssSize(this.element.getAttribute('data-width'));
    const height = toCssSize(this.element.getAttribute('data-height'));
    if (width) target.style.width = width;
    if (height && !this._lines) target.style.height = height;
  }

  /** Genera N líneas de texto; la última más corta (`data-last-width`, 60 % por defecto). */
  _renderLines() {
    const { element } = this;
    element.classList.add('mtx-skeleton-lines');
    if (element.querySelector(':scope > .mtx-skeleton')) return; // SSR: ya renderizado
    const lastWidth = toCssSize(element.getAttribute('data-last-width')) || '60%';
    for (let i = 0; i < this._lines; i += 1) {
      const line = document.createElement('span');
      line.className = 'mtx-skeleton mtx-skeleton--text';
      if (i === this._lines - 1) line.style.width = lastWidth;
      element.appendChild(line);
    }
  }

  /**
   * Envuelve el texto directo en `.mtx-skeleton__text` para ocultarlo con `visibility`
   * (como los hijos elemento) en vez de dejar texto transparente que falla el contraste.
   */
  _wrapTextNodes() {
    Array.from(this.element.childNodes).forEach((node) => {
      if (node.nodeType !== 3 || node.textContent.trim() === '') return;
      const span = document.createElement('span');
      span.className = 'mtx-skeleton__text';
      node.replaceWith(span);
      span.appendChild(node);
    });
  }

  /** @returns {boolean} `true` si envuelve elementos o texto no vacío. */
  _hasContent() {
    return Array.from(this.element.childNodes).some((node) => node.nodeType === 1
      || (node.nodeType === 3 && node.textContent.trim() !== ''));
  }

  /** @returns {HTMLElement[]} Bloques animados (el propio elemento o sus líneas). */
  get blocks() {
    return this._lines
      ? Array.from(this.element.querySelectorAll(':scope > .mtx-skeleton'))
      : [this.element];
  }

  /** @returns {string} Variante actual. */
  get variant() {
    return this._variant;
  }

  /** @returns {string} Animación actual (`pulse`, `wave` o `false`). */
  get animation() {
    return this._animation;
  }

  /**
   * Cambia la forma del bloque (sin efecto en modo `data-lines`, siempre texto).
   *
   * @param {'text'|'circular'|'rectangular'|'rounded'} variant Variante.
   * @returns {this} La instancia.
   */
  setVariant(variant) {
    if (this._lines) return this;
    const next = VARIANTS.includes(variant) ? variant : 'text';
    const { classList } = this.element;
    VARIANTS.forEach((v) => classList.remove(`mtx-skeleton--${v}`));
    classList.add(`mtx-skeleton--${next}`);
    classList.toggle('mtx-skeleton--with-children', this._hasContent());
    this._variant = next;
    return this;
  }

  /**
   * Cambia la animación; `'false'`/`false` la desactiva.
   *
   * @param {'pulse'|'wave'|'false'|false} animation Animación.
   * @returns {this} La instancia.
   */
  setAnimation(animation) {
    const raw = animation === false ? 'false' : String(animation);
    const next = ANIMATIONS.includes(raw) ? raw : 'pulse';
    this.blocks.forEach((block) => {
      block.classList.remove('mtx-skeleton--pulse', 'mtx-skeleton--wave', 'mtx-skeleton--no-animation');
      block.classList.add(next === 'false' ? 'mtx-skeleton--no-animation' : `mtx-skeleton--${next}`);
    });
    this._animation = next;
    return this;
  }
}

/**
 * Resuelve un contenedor a partir de un elemento o selector.
 * @param {HTMLElement|string} target Elemento o selector CSS.
 * @returns {HTMLElement|null} Contenedor.
 */
function resolveContainer(target) {
  if (typeof target === 'string') return document.querySelector(target);
  return target && target.nodeType === 1 ? target : null;
}

/**
 * Utilidad para alternar el estado de carga de una región.
 *
 * El contenedor muestra sus hijos `[data-skeleton-placeholder]` mientras tiene
 * `data-loading` y sus hijos `[data-skeleton-content]` cuando no.
 */
export const skeleton = {
  /**
   * Activa o desactiva la carga: `data-loading`, `aria-busy` y evento `mtx:skeleton:change`.
   *
   * @param {HTMLElement|string} target Contenedor o selector.
   * @param {boolean} [loading=true] `true` mientras se carga.
   * @returns {HTMLElement|null} El contenedor o `null` si no existe.
   */
  set(target, loading = true) {
    const container = resolveContainer(target);
    if (!container) return null;
    const next = Boolean(loading);
    const previous = skeleton.isLoading(container);
    if (next) {
      container.setAttribute('data-loading', '');
      container.setAttribute('aria-busy', 'true');
    } else {
      container.removeAttribute('data-loading');
      container.removeAttribute('aria-busy');
    }
    container.querySelectorAll(':scope > [data-skeleton-placeholder]').forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
    });
    if (previous !== next) {
      emit(container, 'mtx:skeleton:change', { loading: next });
    }
    return container;
  },

  /**
   * Indica si el contenedor está en estado de carga.
   *
   * @param {HTMLElement|string} target Contenedor o selector.
   * @returns {boolean} `true` si tiene `data-loading` (distinto de `"false"`).
   */
  isLoading(target) {
    const container = resolveContainer(target);
    return Boolean(container) && LOADING_TRUE(container.getAttribute('data-loading'));
  },

  /**
   * Alterna el estado de carga.
   *
   * @param {HTMLElement|string} target Contenedor o selector.
   * @returns {boolean} Nuevo estado.
   */
  toggle(target) {
    const next = !skeleton.isLoading(target);
    skeleton.set(target, next);
    return next;
  },
};

/** Sincroniza `aria-busy` de las regiones declarativas con `data-loading`. */
function syncRegions(root = document) {
  root.querySelectorAll('[data-loading]:not([data-loading="false"])').forEach((container) => {
    if (container.querySelector(':scope > [data-skeleton-placeholder], :scope > [data-skeleton-content]')) {
      skeleton.set(container, true);
    }
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => syncRegions());
  } else {
    syncRegions();
  }
}

registerComponent('skeleton', Skeleton);
