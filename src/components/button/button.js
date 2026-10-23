import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { createCircularProgress } from '../progress/progress.js';

const LOADING_POSITIONS = ['center', 'start', 'end'];
const SURFACES = ['primary', 'secondary'];

/**
 * Representa un botón de Materix UI.
 *
 * Uso declarativo:
 * ```html
 * <button class="mtx-button mtx-button--contained" data-mtx="button">
 *   Guardar
 * </button>
 * ```
 *
 * También puede renderizarse como enlace (`<a>`). Como un enlace no soporta
 * el atributo nativo `disabled`, el estado deshabilitado se representa con
 * `aria-disabled="true"`, se retira del orden de tabulación y se bloquea la
 * navegación al hacer clic.
 *
 * Iconos (como `startIcon`/`endIcon` de MUI): `data-start-icon="add"` y
 * `data-end-icon="send"` generan `<span class="mtx-button__icon material-icons">`.
 *
 * Carga (como `loading` de MUI): `data-loading`, `data-loading-position`
 * (`center`|`start`|`end`) y `data-loading-indicator` (texto en lugar del spinner).
 *
 * Superficie de color: `data-surface="primary|secondary"` (clase `mtx-button--on-{surface}`)
 * adapta el botón a un fondo de ese color: contained invertido y text/outlined heredados.
 */
export class Button extends ComponentBase {
  /**
   * Crea una instancia del botón.
   *
   * @param {HTMLElement} element Elemento `<button>` o `<a>` asociado.
   */
  constructor(element) {
    super(element);

    const size = element.getAttribute('data-size');
    if (size && !element.classList.contains(`mtx-button--${size}`)) {
      element.classList.add(`mtx-button--${size}`);
    }
    if (element.hasAttribute('data-small') && !element.classList.contains('mtx-button--small')) {
      element.classList.add('mtx-button--small');
    } else if (element.hasAttribute('data-large') && !element.classList.contains('mtx-button--large')) {
      element.classList.add('mtx-button--large');
    }

    // Color de la paleta o `inherit` (equivale a la clase mtx-button--{color}).
    const color = element.getAttribute('data-color');
    if (color && color !== 'primary' && !element.classList.contains(`mtx-button--${color}`)) {
      element.classList.add(`mtx-button--${color}`);
    }

    // Superficie de color sobre la que se coloca el botón (CTA, banners, AppBar primary).
    const surface = element.getAttribute('data-surface');
    if (SURFACES.includes(surface) && !element.classList.contains(`mtx-button--on-${surface}`)) {
      element.classList.add(`mtx-button--on-${surface}`);
    }

    this._renderIcons();

    this._isLink = element.tagName.toLowerCase() === 'a';

    // El ripple se crea en pointerdown (no click) para que el efecto
    // arranque de inmediato al presionar, sin esperar a soltar el botón.
    this._handlePointerDown = (event) => {
      if (this.disabled || event.button !== 0) return;
      const centered = element.classList.contains('mtx-icon-button');
      createRipple(element, event, { centered });
    };
    element.addEventListener('pointerdown', this._handlePointerDown);

    if (this._isLink) {
      this._handleClick = (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopPropagation();
        }
      };
      element.addEventListener('click', this._handleClick);
    }

    this._loading = false;
    if (element.hasAttribute('data-loading') && element.getAttribute('data-loading') !== 'false') {
      this.setLoading(true);
    }
  }

  /**
   * Genera los iconos de `data-start-icon` / `data-end-icon` (ligadura Material) si aún no existen.
   * Idempotente: no duplica un `.mtx-button__icon` ya presente en ese extremo.
   */
  _renderIcons() {
    const { element } = this;
    const contentNodes = () => Array.from(element.childNodes).filter((node) => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
      && !(node.classList && (node.classList.contains('mtx-ripple-container') || node.classList.contains('mtx-button__loading-indicator'))));
    const isIcon = (node) => Boolean(node && node.classList && node.classList.contains('mtx-button__icon'));
    const createIcon = (name, side) => {
      const icon = document.createElement('span');
      icon.className = `mtx-button__icon mtx-button__icon--${side} material-icons`;
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = name;
      return icon;
    };

    const start = (element.getAttribute('data-start-icon') || '').trim();
    if (start && !isIcon(contentNodes()[0])) {
      element.insertBefore(createIcon(start, 'start'), element.firstChild);
    }
    const end = (element.getAttribute('data-end-icon') || '').trim();
    const nodes = contentNodes();
    if (end && !(nodes.length > 1 && isIcon(nodes[nodes.length - 1]))) {
      element.appendChild(createIcon(end, 'end'));
    }
  }

  /** @returns {boolean} `true` mientras el botón está en estado de carga. */
  get loading() {
    return this._loading;
  }

  /** @param {boolean} value Activa o desactiva la carga. */
  set loading(value) {
    this.setLoading(value);
  }

  /**
   * Activa o desactiva el estado de carga: deshabilita, marca `aria-busy` y muestra el indicador.
   * Al desactivarlo restaura el estado `disabled` previo.
   *
   * @param {boolean} value `true` para cargar.
   * @returns {this} La instancia, para encadenar.
   */
  setLoading(value) {
    const next = Boolean(value);
    if (next === this._loading) return this;
    const { element } = this;
    this._loading = next;

    if (next) {
      this._wasDisabled = this.disabled;
      this._prevTabIndex = element.getAttribute('tabindex');
      if (!this._wasDisabled) this.disable();
      const position = element.getAttribute('data-loading-position');
      this._loadingPosition = LOADING_POSITIONS.includes(position) ? position : 'center';
      element.setAttribute('aria-busy', 'true');
      element.setAttribute('data-loading', '');
      element.classList.add('mtx-button--loading', `mtx-button--loading-${this._loadingPosition}`);
      this._mountIndicator();
    } else {
      element.classList.remove('mtx-button--loading', ...LOADING_POSITIONS.map((p) => `mtx-button--loading-${p}`));
      element.removeAttribute('aria-busy');
      element.removeAttribute('data-loading');
      if (this._indicator) this._indicator.remove();
      this._indicator = null;
      if (this._hiddenIcon) this._hiddenIcon.classList.remove('mtx-button__icon--loading-hidden');
      this._hiddenIcon = null;
      if (!this._wasDisabled) {
        this.enable();
        if (this._isLink) {
          if (this._prevTabIndex === null) element.removeAttribute('tabindex');
          else element.setAttribute('tabindex', this._prevTabIndex);
        }
      }
    }
    return this;
  }

  /** Inserta (o reutiliza) el indicador y oculta el icono que sustituye. */
  _mountIndicator() {
    const { element } = this;
    const position = this._loadingPosition;
    let indicator = element.querySelector(':scope > .mtx-button__loading-indicator');
    if (!indicator) {
      indicator = document.createElement('span');
      const text = element.getAttribute('data-loading-indicator');
      if (text) {
        indicator.textContent = text;
        indicator.classList.add('mtx-button__loading-indicator--text');
      } else {
        indicator.appendChild(createCircularProgress({ size: 16, color: 'inherit', decorative: true }));
      }
    }
    indicator.classList.add('mtx-button__loading-indicator');
    LOADING_POSITIONS.forEach((p) => indicator.classList.toggle(`mtx-button__loading-indicator--${p}`, p === position));
    indicator.setAttribute('aria-hidden', 'true');

    const nodes = Array.from(element.childNodes).filter((node) => node !== indicator
      && !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
      && !(node.classList && node.classList.contains('mtx-ripple-container')));
    const isIcon = (node) => node && node.classList && node.classList.contains('mtx-button__icon');
    if (position === 'start') {
      const first = nodes[0];
      if (isIcon(first)) this._hiddenIcon = first;
      element.insertBefore(indicator, first || null);
    } else if (position === 'end') {
      const last = nodes[nodes.length - 1];
      if (isIcon(last)) this._hiddenIcon = last;
      element.insertBefore(indicator, last ? last.nextSibling : null);
    } else {
      element.appendChild(indicator);
    }
    if (this._hiddenIcon) {
      this._hiddenIcon.classList.add('mtx-button__icon--loading-hidden');
      // Hereda el desplazamiento MUI del icono sustituido: el ancho no cambia al cargar.
      ['start', 'end'].forEach((side) => indicator.classList.toggle(`mtx-button__icon--${side}`,
        this._hiddenIcon.classList.contains(`mtx-button__icon--${side}`)));
    }
    this._indicator = indicator;
  }

  /**
   * Indica si el botón está deshabilitado.
   *
   * Cubre tanto el atributo nativo `disabled` (elementos `<button>`) como
   * `aria-disabled` (necesario cuando el componente se renderiza como
   * `<a>`, que no soporta `disabled` nativamente).
   *
   * @returns {boolean} `true` si el botón está deshabilitado.
   */
  get disabled() {
    return this.element.disabled || this.element.getAttribute('aria-disabled') === 'true';
  }

  /**
   * Deshabilita el botón.
   *
   * En elementos de formulario usa el atributo nativo `disabled`; en enlaces
   * (`<a>`) aplica `aria-disabled` y lo retira del orden de tabulación.
   */
  disable() {
    if (this.element.disabled !== undefined) {
      this.element.disabled = true;
    } else {
      this.element.setAttribute('aria-disabled', 'true');
      this.element.tabIndex = -1;
    }
  }

  /**
   * Habilita el botón.
   */
  enable() {
    if (this.element.disabled !== undefined) {
      this.element.disabled = false;
    } else {
      this.element.removeAttribute('aria-disabled');
      this.element.tabIndex = 0;
    }
  }

  /**
   * Destruye la instancia del botón y elimina los event listeners asociados.
   */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    if (this._isLink) {
      this.element.removeEventListener('click', this._handleClick);
    }
    super.destroy();
  }
}

registerComponent('button', Button);