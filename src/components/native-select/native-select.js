import { ComponentBase } from '../../core/component-base.js';
import { registerComponent } from '../../core/registry.js';
import { uniqueId } from '../../core/id.js';

const CHEVRON_SVG =
  '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" ' +
  'focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>';


/** Variantes admitidas; `standard` es la predeterminada, como en MUI NativeSelect. */
const VARIANTS = ['standard', 'outlined', 'filled'];

/**
 * Representa un select nativo de Materix UI.
 *
 * Sigue el patrón de `NativeSelect` de MUI: usa el `<select>` del navegador
 * directamente con variantes `standard` (predeterminada), `outlined` o `filled`.
 *
 * Uso declarativo:
 * ```html
 * <select data-mtx="native-select" data-label="Edad">
 *   <option value="10">Diez</option>
 * </select>
 * ```
 */
export class NativeSelect extends ComponentBase {
  /**
   * Crea una instancia del select nativo.
   *
   * @param {HTMLElement} element Elemento contenedor o `<select>` directo.
   */
  constructor(element) {
    if (element instanceof HTMLSelectElement && !element.closest('.mtx-native-select')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mtx-native-select';

      Array.from(element.attributes).forEach((attr) => {
        if (attr.name === 'class') {
          // AGENTS §6.3: concatenar para no perder la clase estructural.
          wrapper.className += ` ${attr.value}`;
        } else if ((attr.name.startsWith('data-') && attr.name !== 'data-mtx-initialized') || attr.name === 'label') {
          wrapper.setAttribute(attr.name, attr.value);
        }
      });
      element.removeAttribute('class');

      if (element.parentNode) {
        element.parentNode.insertBefore(wrapper, element);
      }
      wrapper.appendChild(element);
      element = wrapper;
    }

    super(element);

    this.input = element.querySelector('select') || (element instanceof HTMLSelectElement ? element : null);
    if (!(this.input instanceof HTMLSelectElement)) {
      throw new TypeError('NativeSelect requiere un elemento <select>.');
    }
    this.input.classList.add('mtx-native-select__input');

    const declared = element.getAttribute('data-variant');
    const fromClass = VARIANTS.find((name) => element.classList.contains(`mtx-native-select--${name}`));
    this.variant = VARIANTS.includes(declared) ? declared : (fromClass || 'standard');
    element.classList.add(`mtx-native-select--${this.variant}`);
    if (element.hasAttribute('data-small') || element.getAttribute('data-size') === 'small') {
      element.classList.add('mtx-native-select--small');
    }

    // Etiqueta: se crea desde data-label y siempre se vincula con for/id.
    const labelText = element.getAttribute('data-label') || element.getAttribute('label');
    this.label = element.querySelector('.mtx-native-select__label');
    if (!this.label && labelText) {
      this.label = document.createElement('label');
      this.label.className = 'mtx-native-select__label';
      this.label.textContent = labelText;
      element.insertBefore(this.label, this.input);
    }
    if (this.label) {
      if (!this.input.id) this.input.id = uniqueId('mtx-native-select');
      if (this.label.tagName === 'LABEL' && !this.label.htmlFor) this.label.htmlFor = this.input.id;
      if (this.label.tagName !== 'LABEL') {
        if (!this.label.id) this.label.id = `${this.input.id}-label`;
        if (!this.input.hasAttribute('aria-labelledby')) this.input.setAttribute('aria-labelledby', this.label.id);
      }
      element.classList.add('mtx-native-select--has-label');
    }

    this.chevron = element.querySelector('.mtx-native-select__chevron');
    if (!this.chevron) {
      this.chevron = document.createElement('span');
      this.chevron.className = 'mtx-native-select__chevron';
      element.appendChild(this.chevron);
    }
    this.chevron.setAttribute('aria-hidden', 'true');
    if (!this.chevron.firstElementChild) this.chevron.innerHTML = CHEVRON_SVG;

    if (element.hasAttribute('data-error')) {
      element.classList.add('mtx-native-select--error');
      this.input.setAttribute('aria-invalid', 'true');
    }
    if (this.input.multiple) element.classList.add('mtx-native-select--multiple');
  }

  /** @returns {string|string[]} Valor actual. */
  get value() {
    return this.input.multiple
      ? Array.from(this.input.selectedOptions).map((option) => option.value)
      : this.input.value;
  }

  /** @param {string|string[]} value Nuevo valor. */
  set value(value) {
    const values = Array.isArray(value) ? value.map(String) : [String(value)];
    Array.from(this.input.options).forEach((option) => {
      option.selected = values.includes(option.value);
    });
  }

  /** @returns {boolean} Estado deshabilitado. */
  get disabled() {
    return this.input.disabled;
  }

  /** Deshabilita el select. */
  disable() {
    this.input.disabled = true;
  }

  /** Habilita el select. */
  enable() {
    this.input.disabled = false;
  }

  /** Enfoca el select nativo. */
  focus() {
    this.input.focus();
  }
}

registerComponent('native-select', NativeSelect);