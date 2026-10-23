import { ComponentBase } from '../../core/component-base.js';
import { registerComponent, initElement, getInstance } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { emit } from '../../core/events.js';

const SIZES = ['small', 'medium', 'large'];
const COLORS = ['standard', 'primary', 'secondary', 'error', 'warning', 'info', 'success'];
const GROUP_SELECTOR = '.mtx-toggle-button-group, [data-mtx="toggle-button-group"]';
const BUTTON_SELECTOR = 'button, [data-mtx="toggle-button"], .mtx-toggle-button';

/**
 * Indica si un atributo booleano declarativo está activo (presente y distinto de "false").
 * @param {HTMLElement} el Elemento.
 * @param {string} name Nombre del atributo.
 * @returns {boolean} `true` si está activo.
 */
const hasFlag = (el, name) => el.hasAttribute(name) && el.getAttribute(name) !== 'false';

/**
 * Aplica la clase de tamaño y color (`mtx-toggle-button--{x}`) sin duplicarlas.
 * @param {HTMLElement} el Botón.
 * @param {string|null} size Tamaño.
 * @param {string|null} color Color.
 */
function applyAppearance(el, size, color) {
  if (SIZES.includes(size) && size !== 'medium') el.classList.add(`mtx-toggle-button--${size}`);
  if (COLORS.includes(color) && color !== 'standard') el.classList.add(`mtx-toggle-button--${color}`);
}

/**
 * Botón de alternancia (ToggleButton de MUI): estado seleccionado expuesto con `aria-pressed`.
 *
 * Uso declarativo:
 * ```html
 * <button data-mtx="toggle-button" data-value="bold" data-icon="format_bold" aria-label="Negrita"></button>
 * ```
 */
export class ToggleButton extends ComponentBase {
  /**
   * @param {HTMLElement} element Elemento `<button>` asociado.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-toggle-button');
    if (element.tagName === 'BUTTON' && !element.hasAttribute('type')) element.type = 'button';

    applyAppearance(element, element.getAttribute('data-size'), element.getAttribute('data-color'));

    const icon = element.getAttribute('data-icon');
    if (icon && !element.querySelector('.material-icons, .material-symbols-outlined, svg')) {
      const iconEl = document.createElement('span');
      iconEl.className = 'material-icons mtx-toggle-button__icon';
      iconEl.setAttribute('aria-hidden', 'true');
      iconEl.textContent = icon;
      element.insertBefore(iconEl, element.firstChild);
    }

    const selected = hasFlag(element, 'data-selected')
      || element.classList.contains('mtx-toggle-button--selected')
      || element.getAttribute('aria-pressed') === 'true';
    element.classList.remove('mtx-toggle-button--selected');
    this._setPressed(selected);

    if (hasFlag(element, 'data-disabled')) this.disable();

    this._handlePointerDown = (event) => {
      if (this.disabled || event.button !== 0) return;
      createRipple(element, event);
    };
    this._handleClick = () => {
      // Dentro de un grupo, el ToggleButtonGroup decide la selección.
      if (this.disabled || this.group) return;
      this._setPressed(!this.selected);
      emit(element, 'mtx:toggle-button:change', { selected: this.selected, value: this.value });
    };
    element.addEventListener('pointerdown', this._handlePointerDown);
    element.addEventListener('click', this._handleClick);
  }

  /** @returns {HTMLElement|null} Contenedor del grupo, si existe. */
  get group() {
    const parent = this.element.parentElement;
    return parent ? parent.closest(GROUP_SELECTOR) : null;
  }

  /** @returns {string} Valor del botón (`data-value`, `value` o texto). */
  get value() {
    return this.element.getAttribute('data-value')
      ?? (this.element.getAttribute('value') || this.element.textContent.trim());
  }

  /** @returns {boolean} `true` si está seleccionado (`aria-pressed="true"`). */
  get selected() {
    return this.element.getAttribute('aria-pressed') === 'true';
  }

  /**
   * Fija el estado seleccionado sin emitir eventos.
   * @param {boolean} value Nuevo estado.
   */
  set selected(value) {
    this._setPressed(Boolean(value));
  }

  /**
   * Alterna el estado seleccionado sin emitir eventos.
   * @returns {boolean} Nuevo estado.
   */
  toggle() {
    this._setPressed(!this.selected);
    return this.selected;
  }

  /** @returns {boolean} `true` si está deshabilitado (`disabled` o `aria-disabled`). */
  get disabled() {
    return this.element.disabled === true || this.element.getAttribute('aria-disabled') === 'true';
  }

  /** Deshabilita el botón. */
  disable() {
    if (this.element.tagName === 'BUTTON') this.element.disabled = true;
    else this.element.setAttribute('aria-disabled', 'true');
  }

  /** Habilita el botón. */
  enable() {
    if (this.element.tagName === 'BUTTON') this.element.disabled = false;
    this.element.removeAttribute('aria-disabled');
  }

  /** Enfoca el botón. */
  focus() {
    this.element.focus();
  }

  /**
   * @private
   * @param {boolean} pressed Estado.
   */
  _setPressed(pressed) {
    this.element.setAttribute('aria-pressed', String(pressed));
  }

  /** Destruye la instancia y retira los listeners. */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    this.element.removeEventListener('click', this._handleClick);
    super.destroy();
  }
}

/**
 * Grupo de botones de alternancia (ToggleButtonGroup de MUI): selección exclusiva o múltiple.
 *
 * Uso declarativo:
 * ```html
 * <div data-mtx="toggle-button-group" data-exclusive data-value="left" aria-label="Alineación">
 *   <button data-value="left" data-icon="format_align_left" aria-label="Izquierda"></button>
 *   <button data-value="center" data-icon="format_align_center" aria-label="Centro"></button>
 * </div>
 * ```
 */
export class ToggleButtonGroup extends ComponentBase {
  /**
   * @param {HTMLElement} element Contenedor del grupo.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-toggle-button-group');
    if (!element.hasAttribute('role')) element.setAttribute('role', 'group');

    const label = element.getAttribute('data-label');
    if (label && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', label);
    }

    this.exclusive = hasFlag(element, 'data-exclusive') || element.classList.contains('mtx-toggle-button-group--exclusive');
    this.enforceValueSet = hasFlag(element, 'data-enforce-value-set');
    this.orientation = element.getAttribute('data-orientation') === 'vertical'
      || element.classList.contains('mtx-toggle-button-group--vertical') ? 'vertical' : 'horizontal';
    element.classList.toggle('mtx-toggle-button-group--vertical', this.orientation === 'vertical');
    if (hasFlag(element, 'data-full-width')) element.classList.add('mtx-toggle-button-group--full-width');

    const size = element.getAttribute('data-size');
    const color = element.getAttribute('data-color');
    this._buttonElements().forEach((btn) => {
      if (size && !btn.hasAttribute('data-size')) btn.setAttribute('data-size', size);
      if (color && !btn.hasAttribute('data-color')) btn.setAttribute('data-color', color);
      if (!btn.hasAttribute('data-mtx')) btn.setAttribute('data-mtx', 'toggle-button');
      if (getInstance(btn)) applyAppearance(btn, btn.getAttribute('data-size'), btn.getAttribute('data-color'));
      else initElement(btn, 'toggle-button');
    });

    if (element.hasAttribute('data-value')) {
      this.value = this._parseValue(element.getAttribute('data-value'));
    } else if (this.exclusive) {
      // Exclusivo: solo se conserva el primer botón marcado.
      this.value = this.value;
    }

    if (hasFlag(element, 'data-disabled')) this.disable();

    this._handleClick = (event) => this._onClick(event);
    this._handleKeyDown = (event) => this._onKeyDown(event);
    element.addEventListener('click', this._handleClick);
    element.addEventListener('keydown', this._handleKeyDown);
  }

  /**
   * @private
   * @returns {HTMLElement[]} Botones que pertenecen a este grupo (no a grupos anidados).
   */
  _buttonElements() {
    return Array.from(this.element.querySelectorAll(BUTTON_SELECTOR))
      .filter((btn) => btn.parentElement && btn.parentElement.closest(GROUP_SELECTOR) === this.element);
  }

  /** @returns {ToggleButton[]} Instancias de los botones del grupo. */
  get buttons() {
    return this._buttonElements().map((btn) => getInstance(btn)).filter(Boolean);
  }

  /**
   * @private
   * @param {string} raw Valor declarativo (lista separada por comas en modo múltiple).
   * @returns {string|string[]|null} Valor normalizado.
   */
  _parseValue(raw) {
    if (this.exclusive) return raw === '' ? null : raw;
    return raw.split(',').map((part) => part.trim()).filter(Boolean);
  }

  /**
   * Valor actual: `string|null` en modo exclusivo; `string[]` (orden del DOM) en modo múltiple.
   * @returns {string|string[]|null} Valor.
   */
  get value() {
    const selected = this.buttons.filter((btn) => btn.selected).map((btn) => btn.value);
    return this.exclusive ? (selected[0] ?? null) : selected;
  }

  /**
   * Fija el valor sin emitir eventos.
   * @param {string|string[]|null} val Valor (string, array o `null`).
   */
  set value(val) {
    let values;
    if (val === null || val === undefined || val === '') values = [];
    else values = (Array.isArray(val) ? val : [val]).map(String);
    if (this.exclusive) values = values.slice(0, 1);
    let matched = false;
    this.buttons.forEach((btn) => {
      const isSelected = values.includes(btn.value) && !(this.exclusive && matched);
      if (isSelected) matched = true;
      btn.selected = isSelected;
    });
  }

  /**
   * @private
   * @param {MouseEvent} event Clic delegado.
   */
  _onClick(event) {
    const btnEl = event.target.closest ? event.target.closest(BUTTON_SELECTOR) : null;
    if (!btnEl || !this._buttonElements().includes(btnEl)) return;
    const btn = getInstance(btnEl);
    if (!btn || btn.disabled) return;

    const current = this.value;
    let next;
    if (this.exclusive) {
      next = current === btn.value ? null : btn.value;
      if (next === null && this.enforceValueSet) return;
    } else {
      next = current.includes(btn.value)
        ? current.filter((v) => v !== btn.value)
        : [...current, btn.value];
      if (next.length === 0 && this.enforceValueSet) return;
    }
    this.value = next;
    emit(this.element, 'mtx:toggle-button-group:change', { value: this.value });
  }

  /**
   * Flechas, Inicio y Fin mueven el foco entre los botones habilitados.
   * @private
   * @param {KeyboardEvent} event Evento de teclado.
   */
  _onKeyDown(event) {
    const enabled = this.buttons.filter((btn) => !btn.disabled).map((btn) => btn.element);
    const index = enabled.indexOf(event.target);
    if (index === -1) return;
    const vertical = this.orientation === 'vertical';
    const rtl = getComputedStyle(this.element).direction === 'rtl';
    const next = vertical ? 'ArrowDown' : (rtl ? 'ArrowLeft' : 'ArrowRight');
    const prev = vertical ? 'ArrowUp' : (rtl ? 'ArrowRight' : 'ArrowLeft');
    let target = null;
    if (event.key === next) target = enabled[(index + 1) % enabled.length];
    else if (event.key === prev) target = enabled[(index - 1 + enabled.length) % enabled.length];
    else if (event.key === 'Home') target = enabled[0];
    else if (event.key === 'End') target = enabled[enabled.length - 1];
    if (!target) return;
    event.preventDefault();
    target.focus();
  }

  /** @returns {boolean} `true` si todos los botones están deshabilitados. */
  get disabled() {
    const buttons = this.buttons;
    return buttons.length > 0 && buttons.every((btn) => btn.disabled);
  }

  /** Deshabilita todos los botones del grupo. */
  disable() {
    this.buttons.forEach((btn) => btn.disable());
    this.element.setAttribute('aria-disabled', 'true');
  }

  /** Habilita todos los botones del grupo. */
  enable() {
    this.buttons.forEach((btn) => btn.enable());
    this.element.removeAttribute('aria-disabled');
  }

  /** Destruye la instancia y retira los listeners. */
  destroy() {
    this.element.removeEventListener('click', this._handleClick);
    this.element.removeEventListener('keydown', this._handleKeyDown);
    super.destroy();
  }
}

registerComponent('toggle-button', ToggleButton);
registerComponent('toggle-button-group', ToggleButtonGroup);
