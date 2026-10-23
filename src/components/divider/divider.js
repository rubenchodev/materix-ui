import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';

/**
 * Representa una línea divisoria de Materix UI.
 *
 * Uso declarativo:
 * ```html
 * <hr class="mtx-divider" data-mtx="divider" />
 * ```
 *
 * Dentro de una lista usa `<li data-mtx="divider">`: conserva el rol listitem y,
 * vacío, se marca `aria-hidden` (decorativo).
 *
 * Para una división vertical:
 * ```html
 * <div class="mtx-divider mtx-divider--vertical" data-mtx="divider"></div>
 * ```
 */
export class Divider extends ComponentBase {
  /**
   * Indica si el elemento es un `<li>` hijo directo de una lista.
   *
   * @param {HTMLElement} element Elemento a comprobar.
   * @returns {boolean} `true` si está dentro de `<ul>`, `<ol>` o `role="list"`.
   */
  static isListChild(element) {
    const parent = element.parentElement;
    return element.tagName === 'LI' && Boolean(parent)
      && (parent.tagName === 'UL' || parent.tagName === 'OL' || parent.getAttribute('role') === 'list');
  }

  /**
   * Crea una instancia de la división.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-divider')) {
      element.classList.add('mtx-divider');
    }

    const orientation = element.getAttribute('data-orientation');
    if (orientation === 'vertical') {
      element.classList.add('mtx-divider--vertical');
    }

    // Semántica de separador (MUI): <hr> la tiene de forma nativa; el resto necesita role.
    // Excepción: un <li> dentro de <ul>/<ol> debe seguir siendo listitem (axe `list`);
    // si está vacío es decorativo y se oculta para no inflar el recuento de elementos.
    if (Divider.isListChild(element)) {
      const hasText = Boolean(element.getAttribute('data-text') || element.textContent.trim());
      if (!hasText && !element.hasAttribute('role') && !element.hasAttribute('aria-hidden')) {
        element.setAttribute('aria-hidden', 'true');
      }
    } else if (element.tagName !== 'HR' && !element.hasAttribute('role')) {
      element.setAttribute('role', 'separator');
    }
    if (element.classList.contains('mtx-divider--vertical') && !element.hasAttribute('aria-orientation')) {
      element.setAttribute('aria-orientation', 'vertical');
    }

    const variant = element.getAttribute('data-variant');
    if (variant === 'inset') {
      element.classList.add('mtx-divider--inset');
    } else if (variant === 'middle') {
      element.classList.add('mtx-divider--middle');
    }

    if (element.hasAttribute('data-flex-item')) {
      element.classList.add('mtx-divider--flex-item');
    }

    const text = element.getAttribute('data-text') || (element.tagName !== 'HR' && element.children.length === 0 && element.textContent.trim() ? element.textContent.trim() : null);
    if (text) {
      element.classList.add('mtx-divider--text');
      const textAlign = element.getAttribute('data-text-align');
      if (textAlign === 'left' || textAlign === 'right') {
        element.classList.add(`mtx-divider--text-${textAlign}`);
      }
      if (!element.querySelector('.mtx-divider__text')) {
        element.textContent = '';
        const span = document.createElement('span');
        span.className = 'mtx-divider__text';
        span.textContent = text;
        element.appendChild(span);
      }
    }
  }
}

registerComponent('divider', Divider);