import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';

/**
 * CSSBaseline de Materix UI.
 *
 * Aplica un conjunto de estilos de referencia globales (reset y base
 * tipográfica) al contenedor donde se inicializa. Se consume el reset de
 * `src/styles/base.css`; este componente solo marca el contenedor raíz.
 *
 * Uso declarativo:
 * ```html
 * <body class="mtx-root" data-mtx="css-baseline">
 * ```
 */
export class CssBaseline extends ComponentBase {
  /**
   * Crea una instancia del baseline.
   *
   * @param {HTMLElement} element Elemento raíz asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-root');
  }
}

registerComponent('css-baseline', CssBaseline);