import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';

const MAX_WIDTHS = ['xs', 'sm', 'md', 'lg', 'xl'];
const MAX_WIDTH_CLASSES = [...MAX_WIDTHS, 'fluid'].map((v) => `mtx-container--${v}`);

/**
 * Indica si un atributo booleano está activo (presente y distinto de "false").
 * @param {HTMLElement} el Elemento.
 * @param {string} name Atributo.
 * @returns {boolean} Estado.
 */
const isOn = (el, name) => el.hasAttribute(name) && el.getAttribute(name) !== 'false';

/**
 * Container de Materix UI: centra el contenido con un ancho máximo y márgenes laterales (MUI Container).
 *
 * ```html
 * <main data-mtx="container" data-max-width="md">…</main>
 * ```
 */
export class Container extends ComponentBase {
  /**
   * Crea la instancia y aplica la configuración declarativa.
   * @param {HTMLElement} element Elemento contenedor.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-container');

    const maxWidth = element.getAttribute('data-max-width');
    if (maxWidth) {
      try {
        this.setMaxWidth(maxWidth);
      } catch (error) {
        console.warn(error.message);
      }
    }
    if (isOn(element, 'data-disable-gutters')) this.setGutters(false);
    if (isOn(element, 'data-fixed')) this.setFixed(true);
  }

  /**
   * Cambia el ancho máximo.
   * @param {'xs'|'sm'|'md'|'lg'|'xl'|false|'false'} value Breakpoint tope o `false` para ancho completo.
   * @throws {RangeError} Si el valor no es válido.
   */
  setMaxWidth(value) {
    const key = value === false || value === 'false' ? 'fluid' : String(value);
    if (key !== 'fluid' && !MAX_WIDTHS.includes(key)) {
      throw new RangeError(`Container: data-max-width no válido "${value}"`);
    }
    this.element.classList.remove(...MAX_WIDTH_CLASSES);
    this.element.classList.add(`mtx-container--${key}`);
  }

  /**
   * Activa o desactiva los márgenes laterales internos (16px / 24px).
   * @param {boolean} enabled `false` equivale a `data-disable-gutters`.
   */
  setGutters(enabled) {
    this.element.classList.toggle('mtx-container--disable-gutters', !enabled);
  }

  /**
   * Activa o desactiva el ancho fijo por breakpoint.
   * @param {boolean} fixed Estado.
   */
  setFixed(fixed) {
    this.element.classList.toggle('mtx-container--fixed', Boolean(fixed));
  }
}

registerComponent('container', Container);
