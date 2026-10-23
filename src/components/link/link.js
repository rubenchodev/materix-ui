import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';

/**
 * Representa un enlace de Materix UI.
 *
 * Aplica el estilo de `Link` de MUI (color primario, subrayado siempre por defecto)
 * sobre un `<a>` nativo, o sobre un `<button>` cuando la acción no navega
 * (equivale a `component="button"` de MUI). Hereda la tipografía del texto.
 *
 * Uso declarativo:
 * ```html
 * <a class="mtx-link" data-mtx="link" href="/">Inicio</a>
 * <button data-mtx="link">Reenviar código</button>
 * ```
 */
export class Link extends ComponentBase {
  /**
   * Crea una instancia del enlace.
   *
   * @param {HTMLElement} element Elemento `<a>` o `<button>` asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-link')) {
      element.classList.add('mtx-link');
    }

    // Un <button> sin type actuaría como submit dentro de un formulario.
    if (element.tagName === 'BUTTON' && !element.hasAttribute('type')) {
      element.type = 'button';
    }

    const color = element.getAttribute('data-color');
    if (color) {
      element.classList.add(`mtx-link--${color}`);
      element.classList.add(`mtx-link--color-${color}`);
    }

    const underline = element.getAttribute('data-underline');
    if (underline) {
      element.classList.add(`mtx-link--underline-${underline}`);
    }

    this._handleClick = (event) => {
      if (!this.disabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    element.addEventListener('click', this._handleClick);

    if (element.hasAttribute('data-disabled')) this.disable();
  }

  /**
   * Indica si el enlace está deshabilitado.
   *
   * @returns {boolean} `true` si está deshabilitado.
   */
  get disabled() {
    return this.element.disabled === true || this.element.getAttribute('aria-disabled') === 'true';
  }

  /**
   * Deshabilita el enlace: `disabled` en `<button>`; `aria-disabled` y fuera del tabulado en `<a>`.
   */
  disable() {
    if (this.element.tagName === 'BUTTON') {
      this.element.disabled = true;
    } else {
      this.element.setAttribute('aria-disabled', 'true');
      this.element.tabIndex = -1;
    }
  }

  /**
   * Habilita el enlace.
   */
  enable() {
    if (this.element.tagName === 'BUTTON') {
      this.element.disabled = false;
    } else {
      this.element.removeAttribute('aria-disabled');
      this.element.removeAttribute('tabindex');
    }
  }

  /**
   * Destruye la instancia y retira sus listeners.
   */
  destroy() {
    this.element.removeEventListener('click', this._handleClick);
    super.destroy();
  }
}

registerComponent('link', Link);
