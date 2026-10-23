import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { HelperTextController } from '../form-helper-text/form-helper-text.js';
import { wrapToggleInput, readConfig } from '../checkbox/checkbox.js';

const COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

/**
 * Representa un interruptor de Materix UI.
 *
 * Uso declarativo:
 * ```html
 * <input type="checkbox" data-mtx="switch" data-label="Wifi" data-helper-text="Ayuda" />
 * ```
 */
export class Switch extends ComponentBase {
  /**
   * Crea una instancia del interruptor.
   *
   * @param {HTMLElement} root `<input type="checkbox">` o `<label class="mtx-switch">`.
   */
  constructor(root) {
    let element = root;
    if (root.matches('input[type="checkbox"]')) {
      element = root.closest('.mtx-switch') || wrapToggleInput(root, 'mtx-switch');
    }

    super(element);
    element.classList.add('mtx-switch');

    this.input = element.matches('input[type="checkbox"]')
      ? element
      : element.querySelector('input[type="checkbox"]');
    if (!this.input) {
      throw new TypeError('Switch requiere un <input type="checkbox">.');
    }
    this.input.classList.add('mtx-switch__input');
    this.input.setAttribute('role', 'switch');
    const cfg = (name) => readConfig(element, this.input, name);

    let track = element.querySelector('.mtx-switch__track');
    let thumb = element.querySelector('.mtx-switch__thumb');
    if (!track) {
      track = document.createElement('span');
      track.className = 'mtx-switch__track';
      thumb = document.createElement('span');
      thumb.className = 'mtx-switch__thumb';
      track.appendChild(thumb);
      this.input.insertAdjacentElement('afterend', track);
    }
    this.thumb = thumb || element.querySelector('.mtx-switch__thumb');

    const labelText = cfg('data-label') || cfg('label');
    if (labelText && !element.querySelector('.mtx-switch__label')) {
      const labelSpan = document.createElement('span');
      labelSpan.className = 'mtx-switch__label';
      labelSpan.textContent = labelText;
      element.appendChild(labelSpan);
    }
    if (cfg('data-small') !== null || cfg('data-size') === 'small') {
      element.classList.add('mtx-switch--small');
    }
    const color = cfg('data-color');
    if (COLORS.includes(color) && color !== 'primary') element.classList.add(`mtx-switch--${color}`);

    const helperText = cfg('data-helper-text');
    const errorAttr = cfg('data-error');
    if (helperText || errorAttr !== null || element.parentElement?.classList.contains('mtx-form-control')) {
      this.helper = new HelperTextController({ host: element, target: this.input, helperText, errorAttr });
    }

    this._handlePointerDown = (event) => {
      if (
        this.input.disabled
        || cfg('data-disable-ripple') !== null
        || event.button !== 0
      ) return;
      createRipple(this.thumb || element, event, {
        centered: Boolean(this.thumb),
        interactionTarget: element,
      });
    };
    this._handleReadOnlyClick = (event) => {
      if (this.input.readOnly) event.preventDefault();
    };
    this._handleChange = () => this._syncAria();
    element.addEventListener('pointerdown', this._handlePointerDown);
    this.input.addEventListener('click', this._handleReadOnlyClick);
    this.input.addEventListener('change', this._handleChange);
    this._syncAria();
  }

  /** @returns {boolean} `true` si está activado. */
  get checked() {
    return this.input.checked;
  }

  /**
   * Establece el valor comprobado y sincroniza `aria-checked`.
   * @param {boolean} value Nuevo estado.
   */
  set checked(value) {
    this.input.checked = Boolean(value);
    this._syncAria();
  }

  /** Alterna el estado comprobado. */
  toggle() {
    if (!this.disabled && !this.input.readOnly) this.checked = !this.checked;
  }

  /** @returns {boolean} `true` si el interruptor está deshabilitado. */
  get disabled() {
    return this.input.disabled;
  }

  /** Deshabilita el interruptor. */
  disable() {
    this.input.disabled = true;
    if (this.helper) this.helper.setDisabled(true);
  }

  /** Habilita el interruptor. */
  enable() {
    this.input.disabled = false;
    if (this.helper) this.helper.setDisabled(false);
  }

  /** Enfoca el control nativo. */
  focus() {
    this.input.focus();
  }

  /** @returns {boolean} `true` si está en estado de error. */
  get error() {
    return Boolean(this.helper && this.helper.error);
  }

  /**
   * Cambia el texto de ayuda (FormHelperText) bajo el interruptor.
   * @param {string} text Texto; vacío lo elimina.
   */
  setHelperText(text) {
    this._ensureHelper().setHelperText(text);
  }

  /**
   * Activa el estado de error con `aria-invalid` y texto de error opcional.
   * @param {string|boolean} [message=true] Mensaje o `true` para error sin mensaje.
   */
  setError(message = true) {
    this._ensureHelper().setError(message);
  }

  /** Limpia el estado de error. */
  clearError() {
    if (this.helper) this.helper.clearError();
  }

  /** @private */
  _ensureHelper() {
    if (!this.helper) this.helper = new HelperTextController({ host: this.element, target: this.input });
    return this.helper;
  }

  /** Sincroniza `aria-checked` con el estado nativo. */
  _syncAria() {
    this.input.setAttribute('aria-checked', String(this.input.checked));
  }

  /** Destruye la instancia y elimina los event listeners. */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    this.input.removeEventListener('click', this._handleReadOnlyClick);
    this.input.removeEventListener('change', this._handleChange);
    super.destroy();
  }
}

registerComponent('switch', Switch);
