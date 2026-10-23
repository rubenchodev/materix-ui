import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';

const RESPONSIVE_BREAKPOINTS = ['sm', 'md', 'lg', 'xl'];

/**
 * Representa un elemento tipográfico de Materix UI.
 *
 * Aplica las variantes de tipografía de MUI (`h1`–`h6`, `subtitle1/2`,
 * `body1/2`, `button`, `caption`, `overline`) mediante tokens.
 * Responsive: `data-variant-{sm|md|lg|xl}` cambia la variante desde ese breakpoint
 * y `data-responsive` activa la escala fluida de h1–h6.
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-typography mtx-typography--h4" data-mtx="typography">
 *   Título
 * </div>
 * ```
 */
export class Typography extends ComponentBase {
  /**
   * Crea una instancia del elemento tipográfico.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-typography')) {
      element.classList.add('mtx-typography');
    }

    const variant = element.getAttribute('data-variant');
    if (variant) {
      element.classList.add(`mtx-typography--${variant}`);
    } else {
      const tag = element.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        element.classList.add(`mtx-typography--${tag}`);
      }
    }

    // Variante por breakpoint (mobile-first): data-variant-md="h3" → mtx-typography--md-h3.
    RESPONSIVE_BREAKPOINTS.forEach((bp) => {
      const value = element.getAttribute(`data-variant-${bp}`);
      if (value) element.classList.add(`mtx-typography--${bp}-${value}`);
    });

    // Escala fluida de h1–h6 (responsiveFontSizes de MUI).
    if (element.hasAttribute('data-responsive') && element.getAttribute('data-responsive') !== 'false') {
      element.classList.add('mtx-typography--responsive');
    }

    // Colores admitidos: paleta (primary, secondary, error, warning, info, success),
    // texto (text-primary, text-secondary, text-disabled / disabled) e inherit.
    const color = element.getAttribute('data-color');
    if (color) {
      element.classList.add(`mtx-typography--color-${color}`);
    }

    const align = element.getAttribute('data-align');
    if (align) {
      element.classList.add(`mtx-typography--${align}`);
      element.classList.add(`mtx-typography--align-${align}`);
    }

    if (element.hasAttribute('data-no-wrap')) {
      element.classList.add('mtx-typography--no-wrap');
    }

    if (element.hasAttribute('data-gutter-bottom')) {
      element.classList.add('mtx-typography--gutter-bottom');
    }

    if (element.hasAttribute('data-paragraph')) {
      element.classList.add('mtx-typography--paragraph');
    }
  }
}

registerComponent('typography', Typography);