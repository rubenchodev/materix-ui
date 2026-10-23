import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';

/**
 * Representa un botón de solo icono de Materix UI.
 *
 * Uso declarativo:
 * ```html
 * <button class="mtx-icon-button" data-mtx="icon-button" aria-label="Buscar">
 *   <span class="material-icons">search</span>
 * </button>
 * ```
 */
export class IconButton extends ComponentBase {
  /**
   * Crea una instancia del botón de icono.
   *
   * @param {HTMLElement} element Elemento `<button>` asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-icon-button')) {
      element.classList.add('mtx-icon-button');
    }

    const size = element.getAttribute('data-size');
    if (size) {
      element.classList.add(`mtx-icon-button--${size}`);
    }

    const color = element.getAttribute('data-color');
    if (color) {
      element.classList.add(`mtx-icon-button--${color}`);
    }

    const edge = element.getAttribute('data-edge');
    if (edge === 'start' || edge === 'end') {
      element.classList.add(`mtx-icon-button--edge-${edge}`);
    }

    const icon = element.getAttribute('data-icon');
    if (icon && !element.querySelector('.material-icons') && !element.querySelector('svg') && element.children.length === 0) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'material-icons';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = icon;
      element.appendChild(iconSpan);
    }

    this._handlePointerDown = (event) => {
      if (this.disabled || event.button !== 0) return;
      createRipple(element, event, { centered: true });
    };
    element.addEventListener('pointerdown', this._handlePointerDown);
  }

  /**
   * Destruye la instancia y elimina los event listeners asociados.
   */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    super.destroy();
  }
}

registerComponent('icon-button', IconButton);