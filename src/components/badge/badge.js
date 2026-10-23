import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';

/**
 * Representa una insignia (badge) de Materix UI.
 *
 * Sigue la anatomía de `Badge` de MUI: envuelve un elemento hijo y coloca
 * la insignia en su esquina.
 *
 * Atributos `data-*`:
 * - `data-content`: contenido de la insignia (texto, número o HTML).
 * - `data-invisible`: oculta la insignia.
 * - `data-variant`: `standard` (por defecto) o `dot`.
 * - `data-color`: `default`, `primary`, `secondary`, `error`, etc.
 * - `data-anchor`: `top-right`, `top-left`, `bottom-right`, `bottom-left`.
 * - `data-overlap`: `rectangular` (por defecto) o `circular`.
 * - `data-show-zero`: muestra el valor cero (MUI lo oculta por defecto).
 * - `data-max`: valor máximo (por defecto 99; MUI muestra `max+`).
 * - `data-standalone`: insignia en línea sin hijo anclado (p. ej. contador de navegación).
 * - `data-label`: texto accesible; `{0}` se sustituye por el contenido (p. ej. `{0} sin leer`).
 *
 * Uso declarativo:
 * ```html
 * <div class="mtx-badge" data-mtx="badge" data-content="4">
 *   <span class="material-icons">mail</span>
 * </div>
 * ```
 */
export class Badge extends ComponentBase {
  /**
   * Crea una instancia de la insignia.
   *
   * @param {HTMLElement} element Elemento asociado.
   */
  constructor(element) {
    super(element);

    if (!element.classList.contains('mtx-badge')) {
      element.classList.add('mtx-badge');
    }

    this.variant = element.getAttribute('data-variant') || 'standard';
    const maxValue = element.getAttribute('data-max');
    this.max = maxValue === null ? 99 : Number(maxValue);
    this.showZero = this._getBooleanAttribute('data-show-zero');

    this.standalone = this._getBooleanAttribute('data-standalone')
      || element.classList.contains('mtx-badge--standalone');
    if (this.standalone) element.classList.add('mtx-badge--standalone');
    this.labelTemplate = element.getAttribute('data-label');

    this.badge = element.querySelector('.mtx-badge__badge') || document.createElement('span');
    this.badge.classList.add('mtx-badge__badge');
    // Anclada a un hijo es decorativa; en línea (standalone) su número es contenido.
    if (this.standalone && !this.labelTemplate) this.badge.removeAttribute('aria-hidden');
    else this.badge.setAttribute('aria-hidden', 'true');
    if (!this.badge.parentElement) element.appendChild(this.badge);

    if (this.labelTemplate) {
      this.labelElement = element.querySelector('.mtx-badge__label') || document.createElement('span');
      this.labelElement.className = 'mtx-badge__label';
      if (!this.labelElement.parentElement) element.appendChild(this.labelElement);
    }

    if (this.variant === 'dot') element.classList.add('mtx-badge--dot');

    const color = element.getAttribute('data-color') || 'default';
    element.classList.add(`mtx-badge--${color}`);
    const anchor = element.getAttribute('data-anchor');
    if (anchor && anchor !== 'top-right') element.classList.add(`mtx-badge--${anchor}`);
    const overlap = element.getAttribute('data-overlap');
    if (overlap === 'circular') element.classList.add('mtx-badge--overlap-circular');

    this._content = element.getAttribute('data-content');
    this._explicitInvisible = this._getBooleanAttribute('data-invisible');
    this._render();
  }

  /**
   * Obtiene un atributo booleano declarativo.
   *
   * @param {string} name Nombre del atributo.
   * @returns {boolean} `true` salvo cuando su valor es `false`.
   */
  _getBooleanAttribute(name) {
    const value = this.element.getAttribute(name);
    return value !== null && value !== 'false';
  }

  /** Actualiza contenido y visibilidad de la insignia. */
  _render() {
    if (this.variant !== 'dot') {
      const numeric = this._content !== null && /^-?\d+$/.test(this._content);
      const value = numeric ? Number(this._content) : null;
      this.badge.textContent = numeric && Number.isFinite(this.max) && value > this.max
        ? `${this.max}+`
        : (this._content || '');
    }
    const empty = this.variant !== 'dot'
      && (this._content === null || (Number(this._content) === 0 && !this.showZero));
    const invisible = this._explicitInvisible || empty;
    this.element.classList.toggle('mtx-badge--invisible', invisible);
    if (this.labelElement) {
      this.labelElement.textContent = invisible ? '' : this.labelTemplate.replace('{0}', this.badge.textContent || this._content || '');
    }
  }

  /** @returns {string|null} Contenido actual de la insignia. */
  get content() {
    return this._content;
  }

  /** @param {string|number|null} value Nuevo contenido. */
  set content(value) {
    this._content = value === null ? null : String(value);
    this._render();
  }

  /** @returns {boolean} `true` si la insignia está oculta. */
  get invisible() {
    return this.element.classList.contains('mtx-badge--invisible');
  }

  /** @param {boolean} value Estado de visibilidad. */
  set invisible(value) {
    this._explicitInvisible = Boolean(value);
    this._render();
  }
}

registerComponent('badge', Badge);