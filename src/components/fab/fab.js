import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';

/**
 * Representa un botón de acción flotante (FAB) de Materix UI.
 * Basado en la especificación de Material UI (MUI).
 *
 * Uso declarativo:
 * ```html
 * <button class="mtx-fab" data-mtx="fab" aria-label="Agregar">
 *   <span class="material-icons">add</span>
 * </button>
 *
 * <button class="mtx-fab mtx-fab--extended" data-mtx="fab">
 *   <span class="material-icons">add</span>
 *   <span>NUEVO TICKET</span>
 * </button>
 * ```
 */
export class Fab extends ComponentBase {
  /**
   * Crea una instancia del FAB.
   *
   * @param {HTMLElement} element Elemento `<button>` o `<a>` asociado.
   */
  constructor(element) {
    super(element);

    this.element.classList.add('mtx-fab');
    this._isLink = element.tagName.toLowerCase() === 'a';

    // Leer atributos data-* si existen
    const size = element.getAttribute('data-size');
    if (size) this.size = size;

    const color = element.getAttribute('data-color');
    if (color) this.color = color;

    const variant = element.getAttribute('data-variant');
    if (variant === 'extended') this.element.classList.add('mtx-fab--extended');

    const icon = element.getAttribute('data-icon');
    const label = element.getAttribute('data-label');

    if (label) {
      this.element.classList.add('mtx-fab--extended');
    }

    if (icon && !element.querySelector('.material-icons') && !element.querySelector('svg')) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'material-icons';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = icon;
      element.insertBefore(iconSpan, element.firstChild);
    }

    if (label && !element.querySelector('span:not(.material-icons)')) {
      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      element.appendChild(labelSpan);
    }

    this._handlePointerDown = (event) => {
      if (this.disabled || event.button !== 0) return;
      createRipple(element, event);
    };
    element.addEventListener('pointerdown', this._handlePointerDown);

    if (this._isLink) {
      this._handleClick = (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopPropagation();
        }
      };
      element.addEventListener('click', this._handleClick);
    }
  }

  /**
   * Indica si el FAB está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.element.disabled || this.element.getAttribute('aria-disabled') === 'true';
  }

  /**
   * Deshabilita el FAB.
   */
  disable() {
    if (this.element.disabled !== undefined) {
      this.element.disabled = true;
    } else {
      this.element.setAttribute('aria-disabled', 'true');
      this.element.tabIndex = -1;
    }
  }

  /**
   * Habilita el FAB.
   */
  enable() {
    if (this.element.disabled !== undefined) {
      this.element.disabled = false;
    } else {
      this.element.removeAttribute('aria-disabled');
      this.element.tabIndex = 0;
    }
  }

  /** @returns {string} Tamaño del FAB (`small`, `medium`, `large`). */
  get size() {
    return this._size || 'large';
  }

  /** @param {string} value Nuevo tamaño. */
  set size(value) {
    this._size = value;
    this.element.classList.remove('mtx-fab--small', 'mtx-fab--medium', 'mtx-fab--large');
    if (value && value !== 'large') {
      this.element.classList.add(`mtx-fab--${value}`);
    }
  }

  /** @returns {string} Color del FAB. */
  get color() {
    return this._color || 'primary';
  }

  /** @param {string} value Nuevo color. */
  set color(value) {
    this._color = value;
    this.element.classList.remove(
      'mtx-fab--primary',
      'mtx-fab--secondary',
      'mtx-fab--default',
      'mtx-fab--error',
      'mtx-fab--warning',
      'mtx-fab--info',
      'mtx-fab--success',
      'mtx-fab--inherit'
    );
    if (value && value !== 'primary') {
      this.element.classList.add(`mtx-fab--${value}`);
    }
  }

  /**
   * Destruye la instancia del FAB y remueve sus event listeners.
   */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    if (this._isLink) {
      this.element.removeEventListener('click', this._handleClick);
    }
    super.destroy();
  }
}

registerComponent('fab', Fab);
