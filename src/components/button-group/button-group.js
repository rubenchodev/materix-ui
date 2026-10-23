import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, getInstance, initElement } from '../../core/registry.js';

const VARIANTS = ['contained', 'outlined', 'text'];
const SIZES = ['small', 'medium', 'large'];
const COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'inherit'];
const POSITIONS = ['first', 'middle', 'last'];

/**
 * Indica si un atributo booleano `data-*` está activo (presente y distinto de `"false"`).
 * @param {HTMLElement} el Elemento.
 * @param {string} name Nombre del atributo.
 * @returns {boolean} Estado.
 */
function flag(el, name) {
  return el.hasAttribute(name) && el.getAttribute(name) !== 'false';
}

/**
 * Agrupa botones relacionados con bordes unidos (ButtonGroup de MUI).
 *
 * Uso declarativo (los hijos `<button>`/`<a>` se convierten en Button):
 * ```html
 * <div data-mtx="button-group" data-variant="contained" aria-label="Alineación">
 *   <button>Uno</button><button>Dos</button><button>Tres</button>
 * </div>
 * ```
 *
 * La variante, el tamaño, el color y `disableElevation` se heredan en los hijos
 * salvo que el hijo declare los suyos.
 */
export class ButtonGroup extends ComponentBase {
  /**
   * Crea la instancia, aplica la semántica de grupo y prepara los botones.
   *
   * @param {HTMLElement} element Contenedor del grupo.
   */
  constructor(element) {
    super(element);
    const variant = element.getAttribute('data-variant');
    this.variant = VARIANTS.includes(variant) ? variant : (VARIANTS.find((v) => element.classList.contains(`mtx-button-group--${v}`)) || 'outlined');
    const size = element.getAttribute('data-size');
    this.size = SIZES.includes(size) ? size : 'medium';
    const color = element.getAttribute('data-color');
    this.color = COLORS.includes(color) ? color : 'primary';
    this.orientation = element.getAttribute('data-orientation') === 'vertical'
      || element.classList.contains('mtx-button-group--vertical') ? 'vertical' : 'horizontal';

    /** @type {WeakSet<HTMLElement>} Botones deshabilitados por el grupo (no por el autor). */
    this._disabledByGroup = new WeakSet();

    const { classList } = element;
    classList.add('mtx-button-group', `mtx-button-group--${this.variant}`, `mtx-button-group--${this.orientation}`);
    if (this.color !== 'primary') classList.add(`mtx-button-group--${this.color}`);
    if (this.size !== 'medium') classList.add(`mtx-button-group--${this.size}`);
    if (flag(element, 'data-full-width')) classList.add('mtx-button-group--full-width');
    if (flag(element, 'data-disable-elevation')) classList.add('mtx-button-group--disable-elevation');

    if (!element.hasAttribute('role') && element.tagName.toLowerCase() !== 'fieldset') {
      element.setAttribute('role', 'group');
    }
    const label = element.getAttribute('data-label');
    if (label && !element.hasAttribute('aria-label')) element.setAttribute('aria-label', label);
    // aria-orientation no está permitido en role="group" (axe aria-allowed-attr): solo con toolbar.
    if (this.orientation === 'vertical' && element.getAttribute('role') === 'toolbar') {
      element.setAttribute('aria-orientation', 'vertical');
    }

    this.refresh();
    if (flag(element, 'data-disabled')) this.disable();
  }

  /** @returns {HTMLElement[]} Botones directos del grupo. */
  get buttons() {
    return Array.from(this.element.children).filter((el) => el.matches('button, a, .mtx-button, [data-mtx="button"]'));
  }

  /**
   * Prepara los hijos (clases heredadas, Button, posición). Llamar tras añadir o quitar botones.
   *
   * @returns {this} La instancia.
   */
  refresh() {
    const buttons = this.buttons;
    buttons.forEach((button, index) => {
      this._prepareButton(button);
      let position = 'middle';
      if (index === 0) position = 'first';
      if (index === buttons.length - 1) position = buttons.length === 1 ? 'first' : 'last';
      POSITIONS.forEach((p) => button.classList.toggle(`mtx-button-group__${p}`, p === position));
      if (buttons.length === 1) button.classList.add('mtx-button-group__last');
      if (this.isDisabled && !button.disabled && button.getAttribute('aria-disabled') !== 'true') {
        this._setButtonDisabled(button, true);
      }
    });
    return this;
  }

  /**
   * Aplica al hijo la variante/tamaño/color del grupo si no declara los suyos e inicializa Button.
   * @param {HTMLElement} button Botón hijo.
   */
  _prepareButton(button) {
    const { classList } = button;
    classList.add('mtx-button', 'mtx-button-group__grouped');
    if (!VARIANTS.some((v) => classList.contains(`mtx-button--${v}`))) {
      classList.add(`mtx-button--${this.variant}`);
    }
    if (!button.hasAttribute('data-size') && !SIZES.some((s) => classList.contains(`mtx-button--${s}`)) && this.size !== 'medium') {
      classList.add(`mtx-button--${this.size}`);
    }
    if (!button.hasAttribute('data-color') && this.color !== 'primary'
      && !COLORS.some((c) => classList.contains(`mtx-button--${c}`))) {
      classList.add(`mtx-button--${this.color}`);
    }
    if (this.element.classList.contains('mtx-button-group--disable-elevation')) {
      classList.add('mtx-button--disable-elevation');
    }
    if (this.element.classList.contains('mtx-button-group--full-width')) {
      classList.add('mtx-button--full-width');
    }
    if (button.tagName.toLowerCase() === 'button' && !button.hasAttribute('type')) button.type = 'button';
    if (!button.hasAttribute('data-mtx')) button.setAttribute('data-mtx', 'button');
    if (button.getAttribute('data-mtx') === 'button' && !getInstance(button)) initElement(button);
  }

  /**
   * Deshabilita o habilita un botón usando su instancia Button si existe.
   * @param {HTMLElement} button Botón.
   * @param {boolean} disabled Nuevo estado.
   */
  _setButtonDisabled(button, disabled) {
    const instance = getInstance(button);
    if (disabled) {
      this._disabledByGroup.add(button);
      if (instance && typeof instance.disable === 'function') instance.disable();
      else if ('disabled' in button) button.disabled = true;
      else button.setAttribute('aria-disabled', 'true');
    } else {
      this._disabledByGroup.delete(button);
      if (instance && typeof instance.enable === 'function') instance.enable();
      else if ('disabled' in button) button.disabled = false;
      else button.removeAttribute('aria-disabled');
    }
  }

  /** @returns {boolean} `true` si el grupo está deshabilitado. */
  get isDisabled() {
    return this.element.classList.contains('mtx-button-group--disabled');
  }

  /** @returns {boolean} Alias de `isDisabled` (compatibilidad con ComponentBase). */
  get disabled() {
    return this.isDisabled;
  }

  /**
   * Deshabilita todos los botones del grupo (recuerda los que ya lo estaban).
   *
   * @returns {this} La instancia.
   */
  disable() {
    this.element.classList.add('mtx-button-group--disabled');
    this.element.setAttribute('aria-disabled', 'true');
    this.buttons.forEach((button) => {
      const already = button.disabled === true || button.getAttribute('aria-disabled') === 'true';
      if (!already) this._setButtonDisabled(button, true);
    });
    return this;
  }

  /**
   * Habilita los botones que deshabilitó el grupo.
   *
   * @returns {this} La instancia.
   */
  enable() {
    this.element.classList.remove('mtx-button-group--disabled');
    this.element.removeAttribute('aria-disabled');
    this.buttons.forEach((button) => {
      if (this._disabledByGroup.has(button)) this._setButtonDisabled(button, false);
    });
    return this;
  }
}

registerComponent('button-group', ButtonGroup);
