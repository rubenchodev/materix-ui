import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { emit } from '../../core/events.js';

const ICONS = {
  success: '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>',
  info: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
  warning: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
  error: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>',
};

/**
 * Representa una alerta de Materix UI.
 *
 * Sigue la anatomía de `Alert` de MUI. El icono se elige según la severidad.
 *
 * Atributos `data-*`:
 * - `data-severity`: `success`, `info`, `warning` o `error`.
 * - `data-variant`: `standard` (por defecto), `filled` u `outlined`.
 * - `data-dismissible`: muestra un botón de cierre (`data-close-label` cambia su nombre; por defecto i18n `alert.close`).
 * - `data-title`: genera `.mtx-alert__title`.
 * - `data-icon="false"`: oculta el icono.
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-alert" data-mtx="alert" data-severity="success">
 *   <div class="mtx-alert__message">Operación completada.</div>
 * </div>
 * ```
 */
export class Alert extends ComponentBase {
  /**
   * Crea una instancia de la alerta.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);

    const severity = element.getAttribute('data-severity') || 'success';
    const variant = element.getAttribute('data-variant') || 'standard';
    element.classList.add(`mtx-alert--${severity}`, `mtx-alert--${variant}`);
    if (!element.hasAttribute('role')) element.setAttribute('role', 'alert');

    // Icono: respeta un slot proporcionado por el consumidor.
    let icon = element.querySelector('.mtx-alert__icon');
    if (!icon && element.getAttribute('data-icon') !== 'false') {
      icon = document.createElement('span');
      icon.className = 'mtx-alert__icon';
      icon.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" focusable="false" aria-hidden="true">${ICONS[severity] || ICONS.success}</svg>`;
      element.insertBefore(icon, element.firstChild);
    }

    // Botón de cierre
    if (element.hasAttribute('data-dismissible')) {
      // Reutiliza el botón existente (reinicialización o SSR) para no duplicarlo.
      let close = Array.from(element.children).find((child) => child.classList.contains('mtx-alert__close'));
      if (!close) {
        close = document.createElement('button');
        close.type = 'button';
        close.className = 'mtx-alert__close';
        close.setAttribute('aria-label', element.getAttribute('data-close-label')
          || t('alert', 'close', null, 'Close', getComponentLocale(element)));
        close.innerHTML = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" focusable="false" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
        element.appendChild(close);
      }
      this._handleClose = () => this.close();
      this.listen(close, 'click', this._handleClose);
      this.closeButton = close;
    }

    if (!element.classList.contains('mtx-alert')) {
      element.classList.add('mtx-alert');
    }

    // Auto-construir .mtx-alert__message y .mtx-alert__title
    let message = element.querySelector('.mtx-alert__message');
    if (!message) {
      message = document.createElement('div');
      message.className = 'mtx-alert__message';

      const dataTitle = element.getAttribute('data-title');
      if (dataTitle) {
        const titleEl = document.createElement('div');
        titleEl.className = 'mtx-alert__title';
        titleEl.textContent = dataTitle;
        message.appendChild(titleEl);
      }

      // Mover nodos hijos restantes (que no sean icon o close) dentro de message
      const nodesToMove = Array.from(element.childNodes).filter(node => {
        return node !== icon && node !== this.closeButton;
      });
      nodesToMove.forEach(node => message.appendChild(node));

      if (this.closeButton) {
        element.insertBefore(message, this.closeButton);
      } else {
        element.appendChild(message);
      }
    } else {
      const dataTitle = element.getAttribute('data-title');
      if (dataTitle && !message.querySelector('.mtx-alert__title')) {
        const titleEl = document.createElement('div');
        titleEl.className = 'mtx-alert__title';
        titleEl.textContent = dataTitle;
        message.insertBefore(titleEl, message.firstChild);
      }
    }
  }

  /**
   * Cierra (oculta) la alerta.
   */
  close() {
    if (this.element.hidden) return;
    if (this._prefersReducedMotion()) {
      clearTimeout(this._closeTimer);
      this._finishClose();
      return;
    }
    this.element.style.opacity = '0';
    this.element.style.transform = 'translateY(-4px)';
    this.element.style.transition = 'opacity 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1)';
    clearTimeout(this._closeTimer);
    this._closeTimer = setTimeout(() => this._finishClose(), 200);
  }

  /** Oculta la alerta con `hidden` (sale del flujo) y emite `mtx:alert:close`. */
  _finishClose() {
    this._closeTimer = null;
    this.element.hidden = true;
    emit(this.element, 'mtx:alert:close');
  }

  /** @returns {boolean} `true` si el usuario pidió reducir animaciones. */
  _prefersReducedMotion() {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Vuelve a mostrar una alerta cerrada. */
  open() {
    clearTimeout(this._closeTimer);
    this._closeTimer = null;
    this.element.hidden = false;
    requestAnimationFrame(() => {
      if (this.destroyed) return;
      this.element.style.opacity = '1';
      this.element.style.transform = 'translateY(0)';
    });
    emit(this.element, 'mtx:alert:open');
  }

  /** Elimina listeners y temporizadores. */
  destroy() {
    // Destruida durante el fundido de cierre: aplica el estado final sin emitir el evento.
    if (this._closeTimer) this.element.hidden = true;
    clearTimeout(this._closeTimer);
    this._closeTimer = null;
    super.destroy();
  }
}

registerComponent('alert', Alert);
registerComponent('alert-title', ComponentBase);