import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { t, getComponentLocale } from '../../i18n/index.js';
import { emit as emitEvent } from '../../core/events.js';

const DELETE_SVG =
  '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" ' +
  'focusable="false" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z"/></svg>';

/**
 * Representa una etiqueta (chip) de Materix UI.
 *
 * Sigue la anatomía de `Chip` de MUI: avatar, icono, label y delete icon.
 *
 * Atributos `data-*`:
 * - `data-label`: texto del chip (alternativo al contenido).
 * - `data-deletable`: muestra el icono de eliminar (clic o Delete/Backspace con el chip enfocado).
 * - `data-clickable`: hace el chip interactivo (cursor pointer).
 * - `data-variant`: `filled` (por defecto) u `outlined`.
 * - `data-size`: `medium` (por defecto) o `small`.
 * - `data-color`: `default`, `primary`, `secondary`, `error`, `warning`, `info`, `success`.
 * - `data-delete-icon`: HTML del icono de eliminar (por defecto una X SVG).
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-chip" data-mtx="chip" data-label="JavaScript" data-deletable></div>
 * ```
 */
export class Chip extends ComponentBase {
  /**
   * Crea una instancia del chip.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);

    this._ensureStructure();
    this._bindDelete();
    this._bindClick();
  }

  /**
   * Normaliza la estructura interna del chip (avatar, icono, label, delete).
   */
  _ensureStructure() {
    const { element } = this;
    if (!element.classList.contains('mtx-chip')) {
      element.classList.add('mtx-chip');
    }

    // Label: conserva únicamente el texto directo del nodo raíz para no
    // duplicar iconos, avatares ni contenido ya estructurado.
    let label = element.querySelector('.mtx-chip__label');
    const directTextNodes = Array.from(element.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    );
    const directText = directTextNodes.map((node) => node.textContent.trim()).join(' ');
    directTextNodes.forEach((node) => node.remove());
    if (!label) {
      label = document.createElement('span');
      label.className = 'mtx-chip__label';
      element.appendChild(label);
    }
    this.labelEl = label;

    if (element.hasAttribute('data-label')) {
      label.textContent = element.getAttribute('data-label');
    } else if (!label.textContent && directText) {
      label.textContent = directText;
    }

    // Icono si se especifica data-icon
    const iconName = element.getAttribute('data-icon');
    if (iconName && !element.querySelector('.mtx-chip__icon')) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'mtx-chip__icon material-icons';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = iconName;
      element.insertBefore(iconSpan, label);
    }

    // Icono de eliminar: como en MUI no es enfocable ni anunciado (evita controles
    // anidados dentro de role="button"); se elimina con clic o con Delete/Backspace sobre el chip.
    if (element.hasAttribute('data-deletable')) {
      let deleteEl = element.querySelector('.mtx-chip__delete');
      if (deleteEl && /^(BUTTON|A|INPUT)$/.test(deleteEl.tagName)) {
        const replacement = document.createElement('span');
        replacement.className = deleteEl.className;
        replacement.innerHTML = deleteEl.innerHTML;
        deleteEl.replaceWith(replacement);
        deleteEl = replacement;
      }
      if (!deleteEl) {
        deleteEl = document.createElement('span');
        deleteEl.className = 'mtx-chip__delete';
        deleteEl.innerHTML = element.getAttribute('data-delete-icon') || DELETE_SVG;
        element.appendChild(deleteEl);
      }
      deleteEl.removeAttribute('tabindex');
      deleteEl.removeAttribute('role');
      deleteEl.removeAttribute('aria-label');
      deleteEl.setAttribute('aria-hidden', 'true');
      // Pista visual para ratón; el teclado usa Delete/Backspace (anunciado con aria-keyshortcuts).
      deleteEl.title = element.getAttribute('data-delete-label')
        || t('chip', 'delete', null, 'Delete', getComponentLocale(element));
      if (!element.hasAttribute('aria-keyshortcuts')) element.setAttribute('aria-keyshortcuts', 'Delete Backspace');
      this.deleteEl = deleteEl;
    }

    // Clases de estado
    const interactive = element.hasAttribute('data-clickable') || element.hasAttribute('data-deletable');
    if (element.hasAttribute('data-clickable')) {
      element.classList.add('mtx-chip--clickable');
    }
    if (interactive && !/^(BUTTON|A)$/.test(element.tagName)) {
      element.setAttribute('role', 'button');
      if (!element.hasAttribute('tabindex')) element.tabIndex = 0;
    }
    if (element.hasAttribute('data-disabled') || element.getAttribute('aria-disabled') === 'true') {
      this.disable();
    }
    const size = element.getAttribute('data-size');
    if (size && size !== 'medium') element.classList.add(`mtx-chip--${size}`);
    const variant = element.getAttribute('data-variant');
    if (variant && variant !== 'filled') element.classList.add(`mtx-chip--${variant}`);
    const color = element.getAttribute('data-color');
    if (color && color !== 'default') element.classList.add(`mtx-chip--${color}`);
  }

  /**
   * Vincula el evento de eliminación.
   */
  _bindDelete() {
    if (!this.deleteEl) return;
    this._handleDelete = (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (this.disabled) return;
      this.emit('delete');
    };
    this.deleteEl.addEventListener('click', this._handleDelete);
  }

  /**
   * Vincula el evento de clic en chips interactivos.
   */
  _bindClick() {
    if (!this.element.hasAttribute('data-clickable') && !this.deleteEl) return;
    this._handleClick = (event) => {
      if (this.disabled || event.target.closest('.mtx-chip__delete')) return;
      if (this.element.hasAttribute('data-clickable')) this.emit('click');
    };
    this._handleKeydown = (event) => {
      if (this.disabled) return;
      if ((event.key === 'Enter' || event.key === ' ') && this.element.hasAttribute('data-clickable')) {
        event.preventDefault();
        this.element.click();
      } else if ((event.key === 'Delete' || event.key === 'Backspace') && this.deleteEl) {
        event.preventDefault();
        this.emit('delete');
      } else if (event.key === 'Escape') {
        this.element.blur();
      }
    };
    this.element.addEventListener('click', this._handleClick);
    this.element.addEventListener('keydown', this._handleKeydown);
  }

  /**
   * Texto del chip.
   *
   * @returns {string} Texto del label.
   */
  get label() {
    return this.labelEl.textContent;
  }

  /**
   * Establece el texto del chip.
   *
   * @param {string} text Nuevo texto.
   */
  set label(text) {
    this.labelEl.textContent = text;
  }

  /** @returns {boolean} `true` si el chip está deshabilitado. */
  get disabled() {
    return this.element.getAttribute('aria-disabled') === 'true';
  }

  /** Deshabilita interacción y retira el chip del orden de tabulación. */
  disable() {
    this.element.classList.add('mtx-chip--disabled');
    this.element.setAttribute('aria-disabled', 'true');
    if (this.element.hasAttribute('tabindex')) this.element.tabIndex = -1;
  }

  /** Habilita nuevamente el chip. */
  enable() {
    this.element.classList.remove('mtx-chip--disabled');
    this.element.removeAttribute('aria-disabled');
    if (this.element.getAttribute('role') === 'button') this.element.tabIndex = 0;
  }

  /**
   * Desencadena un evento público personalizado sobre el elemento.
   *
   * @param {string} name Nombre del evento (`delete`, `click`, …).
   * @param {Object} [detail] Datos adicionales.
   */
  emit(name, detail = {}) {
    emitEvent(this.element, `mtx:chip:${name}`, detail);
  }

  /**
   * Destruye la instancia y elimina los event listeners.
   */
  destroy() {
    if (this.deleteEl) this.deleteEl.removeEventListener('click', this._handleDelete);
    if (this._handleClick) this.element.removeEventListener('click', this._handleClick);
    if (this._handleKeydown) this.element.removeEventListener('keydown', this._handleKeydown);
    super.destroy();
  }
}

registerComponent('chip', Chip);