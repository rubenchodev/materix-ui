import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { HelperTextController } from '../form-helper-text/form-helper-text.js';

const COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

/**
 * Envuelve un `<input>` suelto en el `<label>` del componente sin copiar los
 * atributos `data-*` de configuración (se leen siempre del input).
 *
 * @param {HTMLInputElement} input Input original.
 * @param {string} className Clase base del contenedor.
 * @returns {HTMLLabelElement} Contenedor generado.
 */
export function wrapToggleInput(input, className) {
  const label = document.createElement('label');
  label.className = className;
  // AGENTS §6.3: concatenar clases, nunca setAttribute('class').
  const extra = input.getAttribute('class');
  if (extra) label.className += ' ' + extra;
  if (input.parentNode) input.parentNode.insertBefore(label, input);
  label.appendChild(input);
  return label;
}

/**
 * Lee un atributo de configuración del contenedor o, en su defecto, del input.
 *
 * @param {HTMLElement} element Contenedor.
 * @param {HTMLInputElement} input Input nativo.
 * @param {string} name Nombre del atributo.
 * @returns {string|null} Valor encontrado.
 */
export function readConfig(element, input, name) {
  if (element.hasAttribute(name)) return element.getAttribute(name);
  return input && input !== element && input.hasAttribute(name) ? input.getAttribute(name) : null;
}

/**
 * Representa una casilla de verificación de Materix UI.
 *
 * Uso declarativo:
 * ```html
 * <input type="checkbox" data-mtx="checkbox" data-label="Opción" data-helper-text="Ayuda" />
 * ```
 */
export class Checkbox extends ComponentBase {
  /**
   * Crea una instancia de la casilla.
   *
   * @param {HTMLElement} root `<input type="checkbox">` o `<label class="mtx-checkbox">`.
   */
  constructor(root) {
    let element = root;
    if (root.matches('input[type="checkbox"]')) {
      element = root.closest('.mtx-checkbox') || wrapToggleInput(root, 'mtx-checkbox');
    }

    super(element);
    element.classList.add('mtx-checkbox');

    this.input = element.matches('input[type="checkbox"]')
      ? element
      : element.querySelector('input[type="checkbox"]');
    if (!this.input) {
      throw new TypeError('Checkbox requiere un <input type="checkbox">.');
    }
    this.input.classList.add('mtx-checkbox__input');
    const cfg = (name) => readConfig(element, this.input, name);

    let box = element.querySelector('.mtx-checkbox__box');
    if (!box) {
      box = document.createElement('span');
      box.className = 'mtx-checkbox__box';
      this.input.insertAdjacentElement('afterend', box);
    }
    this.box = box;

    const labelText = cfg('data-label') || cfg('label');
    if (labelText && !element.querySelector('.mtx-checkbox__label')) {
      const labelSpan = document.createElement('span');
      labelSpan.className = 'mtx-checkbox__label';
      labelSpan.textContent = labelText;
      element.appendChild(labelSpan);
    }
    if (cfg('data-small') !== null || cfg('data-size') === 'small') {
      element.classList.add('mtx-checkbox--small');
    }
    const color = cfg('data-color');
    if (COLORS.includes(color) && color !== 'primary') element.classList.add(`mtx-checkbox--${color}`);
    if (cfg('data-indeterminate') !== null && cfg('data-indeterminate') !== 'false') {
      this.input.indeterminate = true;
    }

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
      createRipple(this.box || element, event, {
        centered: Boolean(this.box),
        interactionTarget: element,
      });
    };
    element.addEventListener('pointerdown', this._handlePointerDown);
    this._handleChange = () => this._syncAria();
    this.input.addEventListener('change', this._handleChange);
    this._syncAria();
  }

  /** @returns {boolean} `true` si está comprobada. */
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

  /** @returns {boolean} `true` si está indeterminada. */
  get indeterminate() {
    return this.input.indeterminate;
  }

  /**
   * Establece el estado indeterminado y sincroniza `aria-checked="mixed"`.
   * @param {boolean} value Nuevo estado.
   */
  set indeterminate(value) {
    this.input.indeterminate = Boolean(value);
    this._syncAria();
  }

  /** Alterna el estado comprobado (limpia el indeterminado, como el navegador). */
  toggle() {
    if (this.disabled) return;
    this.input.indeterminate = false;
    this.checked = !this.checked;
  }

  /** @returns {boolean} `true` si la casilla está deshabilitada. */
  get disabled() {
    return this.input.disabled;
  }

  /** Deshabilita la casilla. */
  disable() {
    this.input.disabled = true;
    if (this.helper) this.helper.setDisabled(true);
  }

  /** Habilita la casilla. */
  enable() {
    this.input.disabled = false;
    if (this.helper) this.helper.setDisabled(false);
  }

  /** Enfoca la casilla nativa. */
  focus() {
    this.input.focus();
  }

  /** @returns {boolean} `true` si está en estado de error. */
  get error() {
    return Boolean(this.helper && this.helper.error);
  }

  /**
   * Cambia el texto de ayuda (FormHelperText) bajo la casilla.
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

  /** Sincroniza `aria-checked` según checked/indeterminate. */
  _syncAria() {
    this.input.setAttribute('aria-checked', this.input.indeterminate ? 'mixed' : String(this.input.checked));
  }

  /** Destruye la instancia y elimina los event listeners. */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    this.input.removeEventListener('change', this._handleChange);
    super.destroy();
  }
}

registerComponent('checkbox', Checkbox);
