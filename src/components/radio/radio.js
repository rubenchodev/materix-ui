import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { createRipple } from '../../core/ripple.js';
import { emit } from '../../core/events.js';
import { HelperTextController } from '../form-helper-text/form-helper-text.js';
import { wrapToggleInput, readConfig } from '../checkbox/checkbox.js';
import { uniqueId } from '../../core/id.js';

const DOT_SVG =
  '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" ' +
  'focusable="false" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>';

const COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];


/**
 * Representa un botón de radio de Materix UI.
 *
 * Uso declarativo:
 * ```html
 * <input type="radio" name="plan" value="pro" data-mtx="radio" data-label="Pro" />
 * ```
 */
export class Radio extends ComponentBase {
  /**
   * Crea una instancia del radio.
   *
   * @param {HTMLElement} root `<input type="radio">` o `<label class="mtx-radio">`.
   */
  constructor(root) {
    let element = root;
    if (root.matches('input[type="radio"]')) {
      element = root.closest('.mtx-radio') || wrapToggleInput(root, 'mtx-radio');
    }

    super(element);
    element.classList.add('mtx-radio');

    this.input = element.matches('input[type="radio"]')
      ? element
      : element.querySelector('input[type="radio"]');
    if (!this.input) {
      throw new TypeError('Radio requiere un <input type="radio">.');
    }
    this.input.classList.add('mtx-radio__input');
    const cfg = (name) => readConfig(element, this.input, name);

    let box = element.querySelector('.mtx-radio__box');
    if (!box) {
      box = document.createElement('span');
      box.className = 'mtx-radio__box';
      this.input.insertAdjacentElement('afterend', box);
    }
    this.box = box;

    const labelText = cfg('data-label') || cfg('label');
    if (labelText && !element.querySelector('.mtx-radio__label')) {
      const labelSpan = document.createElement('span');
      labelSpan.className = 'mtx-radio__label';
      labelSpan.textContent = labelText;
      element.appendChild(labelSpan);
    }
    if (cfg('data-small') !== null || cfg('data-size') === 'small') {
      element.classList.add('mtx-radio--small');
    }
    const color = cfg('data-color');
    if (COLORS.includes(color) && color !== 'primary') element.classList.add(`mtx-radio--${color}`);

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
    // El radio nativo expone su estado; se retira cualquier aria-checked obsoleto.
    this.input.removeAttribute('aria-checked');
  }

  /** @returns {boolean} `true` si está seleccionado. */
  get checked() {
    return this.input.checked;
  }

  /**
   * Establece el estado seleccionado (el navegador desmarca el resto del grupo).
   * @param {boolean} value Nuevo estado.
   */
  set checked(value) {
    this.input.checked = Boolean(value);
  }

  /** @returns {boolean} `true` si el radio está deshabilitado. */
  get disabled() {
    return this.input.disabled;
  }

  /** Deshabilita el radio. */
  disable() {
    this.input.disabled = true;
  }

  /** Habilita el radio. */
  enable() {
    this.input.disabled = false;
  }

  /** Enfoca el control nativo. */
  focus() {
    this.input.focus();
  }

  /** Destruye la instancia. */
  destroy() {
    this.element.removeEventListener('pointerdown', this._handlePointerDown);
    super.destroy();
  }
}

/**
 * Grupo de botones de radio (RadioGroup + FormLabel + FormHelperText de MUI).
 * Añade `role="radiogroup"`, nombre accesible desde `data-label` y texto de ayuda/error.
 *
 * Uso declarativo:
 * ```html
 * <div data-mtx="radio-group" data-name="plan" data-label="Plan" data-helper-text="Puedes cambiarlo luego">
 *   <input type="radio" name="plan" value="a" data-mtx="radio" data-label="A" />
 * </div>
 * ```
 */
export class RadioGroup extends ComponentBase {
  /**
   * @param {HTMLElement} element Elemento contenedor del grupo.
   */
  constructor(element) {
    super(element);
    element.classList.add('mtx-radio-group');
    if (!element.hasAttribute('role')) element.setAttribute('role', 'radiogroup');

    const row = element.getAttribute('data-row');
    const direction = element.getAttribute('data-direction');
    if ((row !== null && row !== 'false') || direction === 'row') {
      element.classList.add('mtx-radio-group--row');
    }

    this.name = element.getAttribute('data-name') || element.getAttribute('name');
    if (this.name) {
      element.querySelectorAll('input[type="radio"]:not([name])').forEach((radio) => {
        radio.name = this.name;
      });
    }

    const labelText = element.getAttribute('data-label');
    const helperText = element.getAttribute('data-helper-text');
    const errorAttr = element.getAttribute('data-error');
    const inFormControl = element.parentElement?.classList.contains('mtx-form-control');

    if (labelText || helperText || errorAttr !== null || inFormControl) {
      this.helper = new HelperTextController({ host: element, target: element, helperText, errorAttr });
    }
    if (labelText) this._buildLabel(labelText);

    this._handleChange = (e) => {
      if (e.target.matches('input[type="radio"]')) {
        emit(this.element, 'mtx:radio-group:change', { value: e.target.value }, { aliases: ['mtx:change'] });
      }
    };
    this.element.addEventListener('change', this._handleChange);
  }

  /** @private */
  _buildLabel(text) {
    const wrapper = this.helper.ensureWrapper();
    let label = wrapper.querySelector(':scope > .mtx-form-label');
    if (!label) {
      label = document.createElement('div');
      label.className = 'mtx-form-label';
      label.id = `${this.element.id || uniqueId('mtx-radio-group')}-label`;
      label.textContent = text;
      wrapper.insertBefore(label, this.element);
    }
    this.labelEl = label;
    if (!this.element.hasAttribute('aria-label') && !this.element.hasAttribute('aria-labelledby')) {
      this.element.setAttribute('aria-labelledby', label.id);
    }
  }

  /** @private */
  _radios() {
    const radios = Array.from(this.element.querySelectorAll('input[type="radio"]'));
    return this.name ? radios.filter((radio) => radio.name === this.name) : radios;
  }

  /** @returns {string} Valor del radio seleccionado ('' si ninguno). */
  get value() {
    const checked = this._radios().find((radio) => radio.checked);
    return checked ? checked.value : '';
  }

  /**
   * Selecciona el radio que coincide con el valor dado.
   * @param {string} val Valor a seleccionar.
   */
  set value(val) {
    this._radios().forEach((radio) => {
      radio.checked = (radio.value === String(val));
    });
  }

  /** @returns {boolean} `true` si todos los radios están deshabilitados. */
  get disabled() {
    const radios = this._radios();
    return radios.length > 0 && radios.every((radio) => radio.disabled);
  }

  /** Deshabilita todos los radios del grupo. */
  disable() {
    this._radios().forEach((radio) => { radio.disabled = true; });
    this.element.setAttribute('aria-disabled', 'true');
    if (this.helper) this.helper.setDisabled(true);
  }

  /** Habilita todos los radios del grupo. */
  enable() {
    this._radios().forEach((radio) => { radio.disabled = false; });
    this.element.removeAttribute('aria-disabled');
    if (this.helper) this.helper.setDisabled(false);
  }

  /** @returns {boolean} `true` si el grupo está en estado de error. */
  get error() {
    return Boolean(this.helper && this.helper.error);
  }

  /**
   * Cambia el texto de ayuda bajo el grupo.
   * @param {string} text Texto; vacío lo elimina.
   */
  setHelperText(text) {
    this._ensureHelper().setHelperText(text);
  }

  /**
   * Activa el estado de error (aria-invalid en el radiogroup) con mensaje opcional.
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
    if (!this.helper) this.helper = new HelperTextController({ host: this.element, target: this.element });
    return this.helper;
  }

  /** Destruye la instancia. */
  destroy() {
    this.element.removeEventListener('change', this._handleChange);
    super.destroy();
  }
}

registerComponent('radio', Radio);
registerComponent('radio-group', RadioGroup);
export { DOT_SVG };
