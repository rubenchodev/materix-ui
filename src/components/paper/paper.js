import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';

/**
 * Representa una superficie elevada de Materix UI.
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-paper mtx-paper--elevation-2" data-mtx="paper">
 *   Contenido
 * </div>
 * ```
 */
export class Paper extends ComponentBase {
  /**
   * Crea una instancia de la superficie.
   *
   * @param {HTMLElement} element Elemento contenedor asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-paper')) {
      element.classList.add('mtx-paper');
    }

    const elevation = element.getAttribute('data-elevation');
    if (elevation !== null && elevation !== '') {
      element.classList.add(`mtx-paper--elevation-${elevation}`);
    }

    const variant = element.getAttribute('data-variant');
    if (variant === 'outlined') {
      element.classList.add('mtx-paper--outlined');
    }

    if (element.hasAttribute('data-square')) {
      element.classList.add('mtx-paper--square');
    }
  }
}

registerComponent('paper', Paper);